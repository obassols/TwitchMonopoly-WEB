import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './Project/components/board/board.component';
import { StreamerPageComponent } from './Project/components/streamer-page/streamer-page.component';
import { MessagePageComponent } from './Project/components/message-page/message-page.component';

const routes: Routes = [
  {
    path: '',
    component: StreamerPageComponent
  },
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: 'messages',
    component: MessagePageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
