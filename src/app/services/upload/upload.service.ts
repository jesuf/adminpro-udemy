import { Injectable } from '@angular/core';
import { ServicesModule } from '../services.module';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServicesModule
})
export class UploadService {

  constructor(private httpClient: HttpClient) { }

  subirArchivo(archivo: File, coleccion: string, id: string) {
    const url = URL_SERVICIOS + '/upload/' + coleccion + '/' + id;
    // creamos un objeto FormData que podamos enviar tal como si estuviesemos mandando un formulario con un submit
    const formData: FormData = new FormData();
    // el primer parametro es el nombre del parametro que estamos recogiendo en el servicio (req.files.imagen)
    formData.append('imagen', archivo, archivo.name);

    // con las opciones reportProgress y observe events, recibiremos todo tipo de eventos en las respuestas, no solo el cuerpo
    return this.httpClient.put(url, formData, {reportProgress: true, observe: 'events'});
  }
}
