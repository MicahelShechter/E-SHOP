import { NgModule } from '@angular/core';
import {MatIconModule, MatDialogRef } from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';



// tslint:disable-next-line:max-line-length
const MaterialComponents = [MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule,
  MatSelectModule, MatStepperModule, MatSidenavModule, MatCheckboxModule];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
