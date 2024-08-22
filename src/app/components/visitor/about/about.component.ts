import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VisitorStore } from '../visitor.store';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [NgClass],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

    visitorStore = inject(VisitorStore)





    ngOnInit() {

    }
}


