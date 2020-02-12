import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionComponent } from './components/option/option.component';
import { TopologyRoutingModule } from './routing';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from '../shared/modules/custom-material/custom-material.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopologyComponent } from './components/topology/topology.component';
import { TopologyDetailComponent } from './components/topology-detail/topology-detail.component';

@NgModule({
  declarations: [OptionComponent, WorkspaceComponent, TopologyComponent, TopologyDetailComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    CustomMaterialModule,
    // BrowserAnimationsModule,
    FormsModule,
    TopologyRoutingModule,
    ReactiveFormsModule,
  ],
})
export class TopologyModule { }
