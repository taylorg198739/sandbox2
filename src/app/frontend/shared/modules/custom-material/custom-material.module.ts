import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatFormFieldModule, MatToolbarModule, MatIconModule, MatInputModule, MatButtonModule, MatTooltipModule } from '@angular/material';

const modules = [
  MatSidenavModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatTooltipModule
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules,
})
export class CustomMaterialModule { }
