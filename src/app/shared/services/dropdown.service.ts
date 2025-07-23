import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from 'src/assets/models/estado';

@Injectable()
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr(): Observable<Estado[]> {
    return this.http.get<Estado[]>('assets/dados/estados.json');
  }
}
