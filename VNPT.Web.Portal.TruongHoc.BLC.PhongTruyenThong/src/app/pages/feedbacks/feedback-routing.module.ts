import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedbackApprovedComponent } from './feedback-approved/feedback-approved.component';
import { FeedbackDetailComponent } from './feedback-detail/feedback-detail.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  {
    path:'',
    component: FeedbackComponent
  },
  {
    path:'danh-sach/:type',
    component: FeedbackComponent
  },
  {
    path:'duyet-phat-hanh/:type',
    component: FeedbackApprovedComponent
  },
  {
    path:'chi-tiet/:id',
    component: FeedbackDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbacksRoutingModule { }
