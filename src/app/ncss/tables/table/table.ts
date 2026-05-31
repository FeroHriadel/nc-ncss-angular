import { Component, Input as NgInput, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, OnChanges, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableControlBar } from './table-control-bar';
import { TableHeader } from './table-header';
import { TableBody } from './table-body';
import { TableFilterService, FilterRow, Column, FilterState } from './table-filter.service';
import { TableZoomService } from './table-zoom.service';
import { FilterPreset } from './table-filter';



// Re-export types for external use
export type { FilterPreset } from './table-filter';
export type { FilterRow, Column, FilterState } from './table-filter.service';

export interface TableProps {
  data: { [key: string]: string | number | boolean | null | undefined | [] | object | any }[];
  columnsConfig?: Column[];
  horizontalSeparators?: boolean;
  verticalSeparators?: boolean;
  striped?: { enabled: boolean; color?: string } | boolean;
  hover?: { enabled: boolean; color?: string } | boolean;
  controls?: boolean;
  filterPresets?: FilterPreset[];
  class?: string;
  style?: { [key: string]: string };
  id?: string;
  controlBarClassName?: string;
  controlBarStyle?: { [key: string]: string };
  headerClassName?: string;
  headerStyle?: { [key: string]: string };
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

@Component({
  selector: 'nc-table',
  templateUrl: './table.html',
  styleUrl: './table.css',
  imports: [CommonModule, TableControlBar, TableHeader, TableBody],
  providers: [TableFilterService, TableZoomService],
  standalone: true
})
export class Table implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('headerElement') headerElementRef!: TableHeader;
  @ViewChild('bodyElement') bodyElementRef!: TableBody;
  @ViewChild('wrapperElement') wrapperRef!: ElementRef<HTMLDivElement>;

  @NgInput() data: TableProps['data'] = [];
  @NgInput() columnsConfig?: Column[];
  @NgInput() horizontalSeparators: boolean = true;
  @NgInput() verticalSeparators: boolean = true;
  @NgInput() striped: boolean | { enabled: boolean; color?: string } = true;
  @NgInput() hover: boolean | { enabled: boolean; color?: string } = true;
  @NgInput() controls: boolean = true;
  @NgInput() filterPresets?: FilterPreset[];
  @NgInput() style?: { [key: string]: string };
  @NgInput('class') class?: string;
  @NgInput() id: string = 'ncss-table';
  @NgInput() ariaLabel?: string;
  @NgInput() ariaDescribedBy?: string;
  @NgInput() controlBarClassName?: string;
  @NgInput() controlBarStyle?: { [key: string]: string };
  @NgInput() headerClassName?: string;
  @NgInput() headerStyle?: { [key: string]: string };

  columns: Column[] = [];
  private renderingHandlers: any = {
    handleBodyScroll: () => {},
    handleHeaderScroll: () => {},
    handleWheelEvent: () => {},
    handleTableMouseDown: () => {},
    handleTableMouseLeave: () => {},
    handleKeyDown: () => {},
    cleanup: () => {}
  };
  previousZoom: number = 1;
  prevFilteredColumnsLength: number = 0;

  // Wrapper methods for template bindings - these won't change after initialization
  readonly handleHeaderScrollWrapper = (e: Event) => this.renderingHandlers.handleHeaderScroll(e);
  readonly handleBodyScrollWrapper = (e: Event) => this.renderingHandlers.handleBodyScroll(e);
  readonly handleWheelEventWrapper = (e: WheelEvent) => this.renderingHandlers.handleWheelEvent(e);
  readonly handleTableMouseDownWrapper = (e: MouseEvent) => this.renderingHandlers.handleTableMouseDown(e);
  readonly handleTableMouseLeaveWrapper = () => this.renderingHandlers.handleTableMouseLeave();

  constructor(
    public filterService: TableFilterService,
    public zoomService: TableZoomService,
    private cdr: ChangeDetectorRef
  ) {
    // Watch for zoom level changes
    effect(() => {
      const currentZoom = this.zoomService.zoomLevel();
      if (this.previousZoom !== currentZoom) {
        if (this.bodyElementRef?.bodyRef) {
          const scrollTop = this.bodyElementRef.bodyRef.nativeElement.scrollTop;
          const scrollLeft = this.bodyElementRef.bodyRef.nativeElement.scrollLeft;

          setTimeout(() => {
            if (this.bodyElementRef?.bodyRef) {
              this.bodyElementRef.bodyRef.nativeElement.scrollTop = scrollTop;
              this.bodyElementRef.bodyRef.nativeElement.scrollLeft = scrollLeft;
            }
          }, 300);
        }

        this.previousZoom = currentZoom;
      }
    });

    // Watch for filtered columns changes
    effect(() => {
      const filteredCols = this.filterService.filteredColumns();
      if (this.prevFilteredColumnsLength !== filteredCols.length) {
        if (this.headerElementRef?.headerRef) {
          this.headerElementRef.headerRef.nativeElement.scrollLeft = 0;
        }
        if (this.bodyElementRef?.bodyRef) {
          this.bodyElementRef.bodyRef.nativeElement.scrollLeft = 0;
          this.bodyElementRef.bodyRef.nativeElement.scrollTop = 0;
        }
        this.prevFilteredColumnsLength = filteredCols.length;
      }
    });
  }

  ngOnInit(): void {
    // Determine columns
    this.columns = this.getColumns();

    // Initialize services
    this.zoomService.initialize(1, 0.5, 1.5, 0.1);
    this.filterService.initialize(this.data, this.columns);
  }

  ngAfterViewInit(): void {
    // Setup rendering handlers for drag scrolling
    const handlers = this.setupDragScrolling(
      this.bodyElementRef.bodyRef,
      this.headerElementRef.headerRef
    );
    // Update properties individually - wrapper methods will call through to these
    Object.assign(this.renderingHandlers, handlers);
    // Handlers were assigned after the first change detection pass; detectChanges resets
    // the baseline so Angular's dev-mode verification check doesn't throw NG0100.
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // Cleanup
    if (this.renderingHandlers.cleanup) {
      this.renderingHandlers.cleanup();
    }
  }

  ngOnChanges(): void {
    if (this.data || this.columnsConfig) {
      this.columns = this.getColumns();
      // Defer filter service updates to avoid change detection errors
      setTimeout(() => {
        this.filterService.updateData(this.data);
        this.filterService.updateColumns(this.columns);
      }, 0);
    }
  }

  private getColumns(): Column[] {
    if (this.columnsConfig && this.columnsConfig.length > 0) {
      return this.columnsConfig;
    }
    if (this.data.length > 0) {
      return Object.keys(this.data[0]).map(key => ({ column: key, displayValue: key }));
    }
    return [];
  }

  getColumnStyle(columnObj: Column): { [key: string]: string } {
    if (columnObj.width) {
      return {
        width: columnObj.width,
        minWidth: columnObj.width,
        maxWidth: columnObj.width
      };
    }
    const count = this.filteredColumns.length;
    if (count > 0) {
      const w = (100 / count) + '%';
      return { width: w, minWidth: '0', maxWidth: w };
    }
    return {};
  }

  private setupDragScrolling(
    bodyRef: ElementRef<HTMLDivElement>,
    headerRef: ElementRef<HTMLDivElement>
  ) {
    let isDragging = false;
    let lastMousePosition = { x: 0, y: 0 };
    let mouseMoveListener: ((e: MouseEvent) => void) | null = null;
    let mouseUpListener: ((e: MouseEvent) => void) | null = null;
    let mouseUpCaptureListener: ((e: MouseEvent) => void) | null = null;

    const handleBodyScroll = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (headerRef?.nativeElement) {
        headerRef.nativeElement.scrollLeft = target.scrollLeft;
      }
    };

    const handleHeaderScroll = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (bodyRef?.nativeElement) {
        bodyRef.nativeElement.scrollLeft = target.scrollLeft;
      }
    };

    const handleWheelEvent = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          this.zoomService.handleZoomIn();
        } else {
          this.zoomService.handleZoomOut();
        }
      }
    };

    const cleanup = () => {
      // Remove all move listeners
      if (mouseMoveListener) {
        document.removeEventListener('mousemove', mouseMoveListener);
        window.removeEventListener('mousemove', mouseMoveListener);
        document.body.removeEventListener('mousemove', mouseMoveListener);
        mouseMoveListener = null;
      }
      // Remove all mouseup listeners
      if (mouseUpListener) {
        document.removeEventListener('mouseup', mouseUpListener);
        window.removeEventListener('mouseup', mouseUpListener);
        document.body.removeEventListener('mouseup', mouseUpListener);
        if (bodyRef?.nativeElement) {
          bodyRef.nativeElement.removeEventListener('mouseup', mouseUpListener);
        }
        mouseUpListener = null;
      }
      // Remove capture listeners
      if (mouseUpCaptureListener) {
        document.removeEventListener('mouseup', mouseUpCaptureListener, true);
        window.removeEventListener('mouseup', mouseUpCaptureListener, true);
        mouseUpCaptureListener = null;
      }
    };

    const handleTableMouseDown = (e: MouseEvent) => {
      // Immediately stop any ongoing drag
      isDragging = false;
      cleanup();
      
      // Start new drag
      isDragging = true;
      lastMousePosition = { x: e.clientX, y: e.clientY };
      e.preventDefault();
      e.stopPropagation();

      mouseMoveListener = (moveEvent: MouseEvent) => {
        // Check flag immediately - don't continue if not dragging
        if (!isDragging) return;
        if (!bodyRef?.nativeElement) return;
        
        moveEvent.preventDefault();
        moveEvent.stopPropagation();
        
        const container = bodyRef.nativeElement;
        const deltaX = moveEvent.clientX - lastMousePosition.x;
        const deltaY = moveEvent.clientY - lastMousePosition.y;
        
        container.scrollLeft -= deltaX;
        container.scrollTop -= deltaY;
        
        if (headerRef?.nativeElement) {
          headerRef.nativeElement.scrollLeft = container.scrollLeft;
        }
        
        lastMousePosition = { x: moveEvent.clientX, y: moveEvent.clientY };
      };

      mouseUpListener = (upEvent: MouseEvent) => {
        upEvent.preventDefault();
        upEvent.stopPropagation();
        // CRITICAL: Stop dragging and cleanup IMMEDIATELY
        isDragging = false;
        // Force cleanup synchronously
        setTimeout(() => cleanup(), 0);
        cleanup();
      };

      // Create a capturing listener that fires first
      mouseUpCaptureListener = (upEvent: MouseEvent) => {
        isDragging = false;
        cleanup();
      };

      // Attach listeners to multiple targets
      document.addEventListener('mousemove', mouseMoveListener);
      window.addEventListener('mousemove', mouseMoveListener);
      document.body.addEventListener('mousemove', mouseMoveListener);
      
      // Attach mouseup to multiple targets
      document.addEventListener('mouseup', mouseUpListener);
      window.addEventListener('mouseup', mouseUpListener);
      document.body.addEventListener('mouseup', mouseUpListener);
      if (bodyRef?.nativeElement) {
        bodyRef.nativeElement.addEventListener('mouseup', mouseUpListener);
      }
      
      // Also add capturing phase listener as first line of defense
      document.addEventListener('mouseup', mouseUpCaptureListener, true);
      window.addEventListener('mouseup', mouseUpCaptureListener, true);
    };

    const handleTableMouseLeave = () => {
      // Immediately stop dragging
      isDragging = false;
      cleanup();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          this.zoomService.handleZoomIn();
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          this.zoomService.handleZoomOut();
        }
      }
    };

    return {
      handleBodyScroll,
      handleHeaderScroll,
      handleWheelEvent,
      handleTableMouseDown,
      handleTableMouseLeave,
      handleKeyDown,
      cleanup
    };
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (this.renderingHandlers.handleKeyDown) {
      this.renderingHandlers.handleKeyDown(e);
    }
  }

  focusWrapper(): void {
    this.wrapperRef?.nativeElement?.focus();
  }

  get wrapperStyle(): { [key: string]: string } {
    return {
      willChange: 'contents',
      ...this.style
    };
  }

  get resultCount(): number {
    return this.filterService.filteredData().length;
  }

  get filteredData(): any[] {
    return this.filterService.filteredData();
  }

  get filteredColumns(): Column[] {
    return this.filterService.filteredColumns();
  }

  get filterState(): FilterState {
    return this.filterService.filterState();
  }

  get isSorting(): boolean {
    return this.filterService.isSorting();
  }

  get zoomLevel(): number {
    return this.zoomService.zoomLevel();
  }

  get minZoom(): number {
    return this.zoomService.minZoom();
  }

  get maxZoom(): number {
    return this.zoomService.maxZoom();
  }
}
