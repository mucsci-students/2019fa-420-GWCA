import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassAreaComponent } from './class-area/class-area.component';
import { CliComponent } from './cli/cli.component';


export const routes: Routes = [
  {path: '',component: ClassAreaComponent},
  {path: 'cli',component: CliComponent},
  {path: '**',redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
