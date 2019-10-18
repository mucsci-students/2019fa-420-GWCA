import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassAreaComponent } from './class-area/class-area.component';
import { CliComponent } from './cli/cli.component';


const routes: Routes = [
  {path: 'cli',component: CliComponent},
  {path: '**',component: ClassAreaComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
