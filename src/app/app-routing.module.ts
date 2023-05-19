import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './Project/components/board/board.component';
import { StreamerPageComponent } from './Project/components/streamer-page/streamer-page.component';

const routes: Routes = [
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: '',
    component: StreamerPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
