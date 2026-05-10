import { Component, Input as NgInput, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, OnChanges, effect } from '@angular/core';
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
  className?: string;
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
  @NgInput() className?: string;
  @NgInput() id: string = 'ncss-table';
  @NgInput() ariaLabel?: string;
  @NgInput() ariaDescribedBy?: string;
  @NgInput() controlBarClassName?: string;
  @NgInput() controlBarStyle?: { [key: string]: string };
  @NgInput() headerClassName?: string;
  @NgInput() headerStyle?: { [key: string]: string };

  columns: Column[] = [];
  renderingHandlers: any = {};
  previousZoom: number = 1;
  prevFilteredColumnsLength: number = 0;

  constructor(
    public filterService: TableFilterService,
    public zoomService: TableZoomService
  ) {
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
    // Setup drag scrolling handlers
    this.setupDragScrolling();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  ngOnChanges(): void {
    if (this.data || this.columnsConfig) {
      this.columns = this.getColumns();
      this.filterService.updateData(this.data);
      this.filterService.updateColumns(this.columns);
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

  private setupDragScrolling(): void {
    const bodyElement = this.bodyElementRef?.bodyRef;
    const headerElement = this.headerElementRef?.headerRef;

    if (!bodyElement || !headerElement) return;

    const body = bodyElement.nativeElement;
    const header = headerElement.nativeElement;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT') {
        return;
      }

      isDragging = true;
      startX = e.pageX - body.offsetLeft;
      startY = e.pageY - body.offsetTop;
      scrollLeft = body.scrollLeft;
      scrollTop = body.scrollTop;
      body.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
      isDragging = false;
      body.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDragging = false;
      body.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - body.offsetLeft;
      const y = e.pageY - body.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      body.scrollLeft = scrollLeft - walkX;
      body.scrollTop = scrollTop - walkY;
    };

    const handleBodyScroll = () => {
      header.scrollLeft = body.scrollLeft;
    };

    const handleHeaderScroll = () => {
      body.scrollLeft = header.scrollLeft;
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          this.zoomService.handleZoomIn();
        } else {
          this.zoomService.handleZoomOut();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        this.zoomService.handleZoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        this.zoomService.handleZoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        this.zoomService.setZoomLevel(1);
      }
    };

    body.addEventListener('mousedown', handleMouseDown);
    body.addEventListener('mouseleave', handleMouseLeave);
    body.addEventListener('mouseup', handleMouseUp);
    body.addEventListener('mousemove', handleMouseMove);
    body.addEventListener('scroll', handleBodyScroll);
    header.addEventListener('scroll', handleHeaderScroll);
    body.addEventListener('wheel', handleWheel);

    this.renderingHandlers = {
      handleTableMouseDown: handleMouseDown,
      handleTableMouseLeave: handleMouseLeave,
      handleBodyScroll: handleBodyScroll,
      handleHeaderScroll: handleHeaderScroll,
      handleWheelEvent: handleWheel,
      handleKeyDown: handleKeyDown
    };
  }

  getColumnStyle(columnObj: Column): { [key: string]: string } {
    if (columnObj.width) {
      return { 
        width: columnObj.width,
        minWidth: columnObj.width,
        maxWidth: columnObj.width
      };
    }
    return {};
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
