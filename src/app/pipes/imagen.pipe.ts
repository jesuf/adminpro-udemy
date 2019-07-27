import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  // si no se manda parametro coleccion, asumimos que queremos una imagen de usuario
  transform(img: any, coleccion: string = 'usuarios'): any {

    const url = URL_SERVICIOS + '/imagenes';

    // si el parametro img es undefined (porque el documento no tiene imagen),
    // mandamos una ruta que no existe para que el servidor muestre la imagen por defecto no-img.jpg
    if (img === undefined) {
      return url + '/usuarios/mostramos_no-img';
    }

    // si el parametro img empieza por https significa que estamos ante una ruta de imagen completa (imagen de perfil de google)
    // por lo que retornamos la misma ruta sin hacer nada más
    if (img.indexOf('https') === 0) {
      return img;
    }

    // si el parametro coleccion no es uno de los posibles parametros aceptados, tambien mostraremos la imagen por defecto
    const coleccionesPermitidas = ['hospitales', 'medicos', 'usuarios'];
    if (coleccionesPermitidas.indexOf(coleccion) < 0) {
      console.log('Colección no válida. Pruebe con ' + coleccionesPermitidas.join(', '));
      return url + '/usuarios/mostramos_no-img';
    }

    // si llegamos hasta aquí, es el momento de retornar la url completa de la imagen según la coleccion
    return url + '/' + coleccion + '/' + img;
  }
}
