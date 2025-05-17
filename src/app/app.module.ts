import { AngularFirestore } from '@angular/fire/firestore';
import '../../node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js';
import { AppHelperCommponent } from './apphelper/apphelper';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { UserIdleModule } from 'angular-user-idle';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SidebarModule } from 'primeng/sidebar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

const appRoutes: Routes = [
  //form systemad
  { path: '', redirectTo: 'frmselectbranch', pathMatch: 'full' },
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AccordionModule,
    BrowserAnimationsModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    InputTextareaModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    NgxSpinnerModule,
    DialogModule,
    ToastModule,
    AutoCompleteModule,
    CardModule,
    PanelModule,
    SidebarModule,
    HttpClientModule,
    PerfectScrollbarModule,
    TooltipModule,
    CalendarModule,
    ReactiveFormsModule,
    Ng2GoogleChartsModule,
    ConfirmDialogModule,
    DeviceDetectorModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: true, scrollPositionRestoration: 'enabled' }), // { useHash: true } สำหรับเข้า link แบบผ่าน url ที่ต้องการได้
    UserIdleModule.forRoot({ idle: 60, timeout: 30, ping: 120 }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment["firebaseConfig"]),
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  providers: [AppHelperCommponent, AngularFirestore, ConfirmationService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
