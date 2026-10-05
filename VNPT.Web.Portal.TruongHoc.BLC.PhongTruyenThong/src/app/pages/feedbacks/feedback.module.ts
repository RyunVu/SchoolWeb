import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/services/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FeedbacksRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback/feedback.component';

import {GalleriaModule} from 'primeng/galleria';
import {TimelineModule} from 'primeng/timeline';

import { PopupImageModal } from './feedback/popupImage.modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { imageUrlPipe } from 'src/app/pipes';
import { FeedbackDetailComponent } from './feedback-detail/feedback-detail.component';
import { FeedbackDetailModal } from './feedback-detail/feedback-detail.modal';
import { FeedbackChiDaoModal } from './feedback-detail/feedback-chidao.modal';
import { FeedbackChiaSeModal } from './feedback-detail/feedback-chiase.modal';
import { FeedbackChuyenDonViModal } from './feedback-detail/feedback-chuyendonvi.modal';
import { FeedbackQuaTrinhXuLyModal } from './feedback-detail/feedback-quatrinhxuly.modal';
import { FeedbackBaoCaoModal } from './feedback-detail/feedback-baocao.modal';
import { FeedbackPhatHanhModal } from './feedback-detail/feedback-phathanh.modal';
import { FeedbackApprovedComponent } from './feedback-approved/feedback-approved.component';


@NgModule({
    declarations: [
        FeedbackComponent,
        PopupImageModal,
        FeedbackDetailComponent,
        FeedbackDetailModal,
        FeedbackChiDaoModal,
        FeedbackChiaSeModal,
        FeedbackChuyenDonViModal,
        FeedbackQuaTrinhXuLyModal,
        FeedbackBaoCaoModal,
        FeedbackPhatHanhModal,
        FeedbackApprovedComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule, 
        FeedbacksRoutingModule,
        GalleriaModule,
        TimelineModule,
        ToastrModule.forRoot(),
    ],
    entryComponents: [
        PopupImageModal,
        FeedbackDetailModal,
        FeedbackChiDaoModal,
        FeedbackChiaSeModal,
        FeedbackChuyenDonViModal,
        FeedbackQuaTrinhXuLyModal,
        FeedbackBaoCaoModal,
        FeedbackPhatHanhModal,
    ],
    providers: [
        ToastrService
    ]
})
export class FeedbacksModule { }
