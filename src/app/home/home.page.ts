import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public edad:number;
  public creatinina:number;
  public sexo:string ="F";
  public raza:string = "B";

  constructor(public alertController: AlertController) {}
  calcular(){
    //console.log(this.edad,this.creatinina,this.sexo,this.raza);
    if(this.edad == null){
      this.showAlert('Error', 'Debe ingresar una edad');
      return;
    }
    if(this.creatinina == null){
      this.showAlert('Error', 'Debe ingresar el valor de la creatinina');
      return;
    }
    let afro = this.raza == "B" ? false : true;
    let resultado = this.calcularTFGe(this.creatinina,this.edad,this.sexo,afro);
    let mensaje = resultado >= 30 ? 'Paciente con función renal normal o moderadamente reducida' : 'Paciente con función renal severamente reducida';
    this.showAlert('Resultado', `<b>${resultado} mL/min/1.73 m<sup>2</sup></b> <br><br>
                                <i>${mensaje}</i>`);
  }

  async showAlert(header:string, mensaje:string) {
    let alerta = await this.alertController.create({
      header: header,
      message: mensaje,
      buttons: ['OK']
    });
    await alerta.present();
  }

  calcularTFGe(scr,edad,sexo,afro){
    try{
      scr = parseFloat(scr);
      let k = 0,
          a = 0;
      if(sexo.trim() == 'M'){
        k = 0.9;
        a = -0.411;
      }else if (sexo.trim() == 'F'){
        k = 0.7;
        a = -0.329;
      }
      let min = Math.min(scr/k, 1);
      let max = Math.max(scr/k,1);
      //let TFGe = 141 * (min * a) * (max - 1.209) * (0.993*edad);
      let TFGe = 141 * (Math.pow(min,a)) * (Math.pow(max, - 1.209)) * (Math.pow(0.993,edad));
      if(sexo.trim() == 'F'){
        TFGe = TFGe * 1.018;
      }
      if(afro){
        TFGe = TFGe * 1.159;
      }
      TFGe = Math.round(TFGe*100) / 100;
      return TFGe;
    }catch(err){
      return err.message; 
    }
  }

  limpiar(){
    this.creatinina=null;
    this.edad=null;
    this.raza="B",
    this.sexo="F";
  }
}
