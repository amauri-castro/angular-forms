import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }

  constructor(private http: HttpClient,
    private cepService: ConsultaCepService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    console.log(form)
    //console.log(this.usuario)

    this.http.post('enderecoServer/formUsuario', JSON.stringify(form.value))
      .subscribe(dados => {
        console.log(dados);
        form.form.reset();


      })
  }

  consultaCEP(cep: string, form: NgForm) {
    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        ?.subscribe(dados => { this.populaDadosForm(dados, form) })
    }
  }

  populaDadosForm(dados: any, formulario: NgForm) {
    /*
    formulario.setValue({
      nome: formulario.value.nome,
      email: formulario.value.email,
      endereco: {
        rua: dados.localidade,
        cep: dados.cep,
        numero: '',
        complemento: '',
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
        

      }
    });*/
    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      }
    });
    //console.log(formulario)
  }

  verificaValidTouched(campo: any) {
    return !campo.valid && campo.touched;
  }

  resetarFormulario(formulario: NgForm) {
    formulario.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      }
    });
  }
  aplicaCssErro(campo: any) {
    return {
      'was-validated': this.verificaValidTouched(campo)
    }
  }

}
