import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DropdownService } from '../shared/services/dropdown.service';
import { Estado } from 'src/assets/models/estado';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;
  estados?: Observable<Estado[]>;
  cargos: any[] = [];
  tecnologias: any[] = [];
  newsletterOptions: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService
  ) {

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]

      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],

    });

  }

  ngOnInit(): void {
    this.estados = this.dropdownService.getEstadosBr();
    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOptions = this.dropdownService.getNewsletter();
  }

  onSubmit() {
    console.log(this.formulario);
    if (this.formulario.valid) {
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
        .subscribe(dados => {
          console.log(dados)
          this.formulario.reset();

        },
          (error: any) => alert('erro'));

    } else {
      console.log('formulario invalido');
      this.verificaValidacoesForm(this.formulario)
    }

  }

  verificaValidacoesForm(formgroup: FormGroup) {
    Object.keys(formgroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formgroup.get(campo);
      controle?.markAsDirty();

      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  verificaValidTouched(campo: string) {
    return !this.formulario.get(campo)?.valid && (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty);

  }

  verificaEmailInvalido() {
    let campoEmail = this.formulario.get('email');
    if (campoEmail?.errors) {
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  aplicaCssErro(campo: string) {
    return {
      'is-invalid': this.verificaValidTouched(campo),
      'is-valid': !this.verificaValidTouched(campo) && !this.formulario.get(campo)?.pristine
    }
  }

  consultaCEP() {
    let cep = this.formulario.get('endereco.cep')?.value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        ?.subscribe(dados => { this.populaDadosForm(dados) })
    }
  }


  populaDadosForm(dados: any) {
    this.formulario.patchValue({
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

  resetarFormulario() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      }
    });
  }



  resetar() {
    this.formulario.reset();
  }

  setarCargo() {
    const cargo = {nome: 'Dev', nivel: 'Pleno', descricao: 'Dev Pleno'};
    this.formulario.get('cargo')?.setValue(cargo);
  }

  compararCargos(obj1: any, obj2: any) {
    return obj1 && obj2 
    ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) 
    : obj1 === obj2;
  }

  compararTecnologias() {

  }

  setarTecnologia() {
    this.formulario.get('tecnologias')?.setValue(['php', 'python']);
  }

}
