import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})



export class ThemeService {
    private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
    public theme$ = this.themeSubject.asObservable();


    public setTheme(theme: 'light' | 'dark') {
        this.themeSubject.next(theme);
    }

    public getTheme(): 'light' | 'dark' {
        return this.themeSubject.getValue();
    }

}