import { Component, OnInit, Input } from '@angular/core';
// import { SharedService } from 'services/shared.service';

@Component({
    selector: 'app-mode-img',
    templateUrl: './template.html',
    styleUrls: ['./component.scss'],
})
export class ModeImgComponent implements OnInit {
    @Input() width;
    @Input() src;
    @Input() whiteSrc;
    mode = true;
    // constructor(private sharesService: SharedService) { }
    constructor() { }

    ngOnInit() {
        const body = document.getElementsByTagName('body')[0];
        this.mode = !body.classList.contains('white-content');
        // this.sharesService.mode.subscribe(mode => {
        //     this.mode = mode;
        // });
    }

}
