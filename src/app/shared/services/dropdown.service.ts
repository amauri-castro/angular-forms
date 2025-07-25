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

  getCargos() {
    return [
      {nome: 'Dev', nivel: 'Junior', descricao: 'Dev Junior'},
      {nome: 'Dev', nivel: 'Pleno', descricao: 'Dev Pleno'},
      {nome: 'Dev', nivel: 'Senior', descricao: 'Dev Senior'},
    ]
  }

  getTecnologias() {
    return [
      {nome: 'java', descricao: 'Java'},
      {nome: 'javascript', descricao: 'JavaScript'},
      {nome: 'php', descricao: 'PHP'},
      {nome: 'python', descricao: 'Python'},
      {nome: 'ruby', descricao: 'Ruby'}
    ]
  }

  getNewsletter() {
    return [
      {valor: 's', descricao: 'Sim'},
      {valor: 'n', descricao: 'Não'}
    ];
  }
}
