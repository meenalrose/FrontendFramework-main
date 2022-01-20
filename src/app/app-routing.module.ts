import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkListComponent } from './mark-list/mark-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StudentsListComponent } from './students-list/students-list.component';

const routes: Routes = [
  { path: 'students', component: StudentsListComponent },
  { path: 'marks', component: MarkListComponent },
  { path: '', redirectTo: 'students', pathMatch: 'full' },

  // { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
