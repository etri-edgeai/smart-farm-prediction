import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http.service';
import { InternalDto } from '@libs/models/sensor';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'smart-farm-application-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['sensingTime', 'temp', 'humidity', 'co2'];
  dataSource = new MatTableDataSource();

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.http.get<InternalDto[]>("getInternal", {key: 'value'})
      .subscribe(data => {
        this.dataSource.data = data;
      });

  }
}
