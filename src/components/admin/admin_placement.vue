<template>



    <v-row>
        <v-col cols="6">

        </v-col>

        <v-col cols="6" align="center">

            <v-select v-model="categoria" label="Select" :items="['Kids', 'General']"></v-select>

            <br>
            <div style="position: relative; width: 420px; height: 310px; overflow: hidden;">
                <video id="video-registro" autoplay width="420" height="310" style="border-radius: 15px;"></video>
                <canvas id="faceCanvas"></canvas>
            </div>
            <br>
            <!-- <v-progress-linear :model-value="iProgressBar" bg-color="success" color="error"></v-progress-linear> -->
            <canvas style="display:none;" id="canvas-captura-photo" width="420" height="310">
                <img src="" id="photo" alt="photo" />
            </canvas>

            <br>



        </v-col>

    </v-row>


</template>

<script>
//import maestroAddCorreosUsuarios from '../components/admin/admin_maestroAddCorreosUsuarios.vue'
//import navbarAdmin from '../components/common/navbarAdmin.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { BACKEND_URL } from '../../config'

export default {
    data() {
        return {
            categoria: "",
            mostrarInstrucciones: true,
            mostrarRegistrar: true,
            video: null,
            canvas: null,
            label: '',
            descriptions: [],
            detectionCanva: null,
            i: 0,
            iProgressBar: 0,
            fotoURL: null,
            labelDuplicado: null,
            NombrelabelDuplicado: null,

        };
    },
    beforeUnmount() {
        if (this.video != null) {
            this.apagarVideo("video-registro");
        }
    },
    mounted() {
        this.registrar()
    },
    components: {
        //maestroAddCorreosUsuarios,
        //navbarAdmin,

    },
    methods: {
        async registrar() {
            /* Validación label duplicado */
            //const formData1 = new FormData();
            //formData1.append('label', this.label);

            //const url1 = `${BACKEND_URL}/api/validarDescriptorsDuplicados`

            /* await axios.post(url1, formData1).then(res => {
                console.log(res.data)
                this.labelDuplicado = res.data[0]
                this.label = res.data[1]
            })
                .catch(err => {
                    console.log('Error al verificar duplicidad');
                    console.log(err);
                }); */


            /* if (this.labelDuplicado == true) {
                this.SADobleRegistroLabel(this.label)
                this.label = ''
            }
            else { */
            this.SACargandoCamara()
            /* this.mostrarRegistrar = true;
            this.numberCamareActive = 1 */
            clearInterval(this.detectionCanva)

            const video = await this.inicializarVideo("video-registro");
            this.video = video;
            this.SAClose()
            this.tomarFotosAutomaticamente()
            /* } */
        },
        async tomarFotosAutomaticamente() {
            const canvas = document.getElementById('canvas-captura-photo');
            const photo = document.getElementById("photo");
            let context = canvas.getContext("2d");

            // Esperar medio segundo antes de tomar una foto
            /* await this.sleep(500); */
            // Tomar una foto
            let i = 1;
            while (i > 0) {
                context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
                let imgAsBase64String = canvas.toDataURL("image/png");
                photo.setAttribute("src", imgAsBase64String);

                // Procesar la foto, obtener los descriptors, etc.  
                const img = await faceapi.fetchImage(imgAsBase64String);
                const detections = await faceapi.detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.9 })).withFaceLandmarks().withFaceDescriptor();

                const cuadro = document.getElementById('faceCanvas');
                const displaySize = { width: this.video.width, height: this.video.height };
                faceapi.matchDimensions(cuadro, displaySize);

                //const detection = await faceapi.detectAllFaces(this.video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.9 })).withFaceLandmarks().withFaceExpressions().withFaceDescriptors();
                const detection = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors().withAgeAndGender()
                // Configura el color del trazo en verde
                //console.log(detection);


                if (this.categoria == "Kids") {
                    if (typeof detection != "undefined") {
                        if (Object.keys(detection).length > 1) {
                            this.SAMasRostrosDetectados();
                            //break;
                            // this.$router.push('/registrar');
                        } else {
                            const resizedDetection = faceapi.resizeResults(detection, displaySize);
                            //console.log(detection);
                            // Clear previous drawings
                            cuadro.getContext('2d').clearRect(0, 0, cuadro.width, cuadro.height);
                            const contexto = cuadro.getContext('2d');
                            contexto.clearRect(0, 0, cuadro.width, cuadro.height);


                            //faceapi.draw.drawDetections(cuadro, resizedDetection);
                            //faceapi.draw.drawFaceLandmarks(cuadro, resizedDetection);
                            //faceapi.draw.drawFaceExpressions(cuadro, resizedDetection);
                            //faceapi.draw.drawFaceExpressions(cuadro, resizedDetection)
                            console.log(Math.round(detection.age))


                            resizedDetection.forEach(detection => {
                                const box = detection.detection.box

                                if (Math.round(detection.age) > 12) {
                                    const drawBox = new faceapi.draw.DrawBox(box, { label: " se requiere menor de edad " })
                                    drawBox.draw(cuadro)

                                } else {
                                    const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " años " })
                                    drawBox.draw(cuadro)
                                }

                            })

                        }
                    }
                } else if (this.categoria == "General") {

                    if (typeof detection != "undefined") {
                        if (Object.keys(detection).length > 1) {
                            this.SAMasRostrosDetectados();
                            //break;
                            // this.$router.push('/registrar');
                        } else {
                            const resizedDetection = faceapi.resizeResults(detection, displaySize);
                            //console.log(detection);
                            // Clear previous drawings
                            cuadro.getContext('2d').clearRect(0, 0, cuadro.width, cuadro.height);
                            const contexto = cuadro.getContext('2d');
                            contexto.clearRect(0, 0, cuadro.width, cuadro.height);


                            //faceapi.draw.drawDetections(cuadro, resizedDetection);
                            faceapi.draw.drawFaceLandmarks(cuadro, resizedDetection);
                            //faceapi.draw.drawFaceExpressions(cuadro, resizedDetection);

                            /* resizedDetection.forEach(detection => {
                                const box = detection.detection.box
                                const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " años " })
                                drawBox.draw(cuadro)
                            }) */
                        }
                    }

                }
            }

            // Draw a square around each detected face
            //faceapi.draw.drawDetections(cuadro, resizedDetections);



        },

        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },

        dataURItoBlob(dataURI) {
            const byteString = atob(dataURI.split(',')[1]);
            const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        },


        /**********************************/
        /***************** Funciones para manipulación de cámara /*****************/
        /**********************************/

        inicializarVideo(id) {

            // inicializar camara
            const videoEl = document.getElementById(id);

            return Promise.all([
                //Modelos para reconocimiento facial
                faceapi.nets.tinyFaceDetector.loadFromUri('/models/modelosReconocimientoFacial'),
                faceapi.nets.ssdMobilenetv1.loadFromUri('/models/modelosReconocimientoFacial'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models/modelosReconocimientoFacial'),
                faceapi.nets.mtcnn.loadFromUri('/models/modelosReconocimientoFacial'),

                //Modelos para detección de  máscara facial, expresiones, edad.
                faceapi.nets.faceLandmark68Net.loadFromUri('/models/modelosReconocimientoFacial'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models/modelosReconocimientoFacial'),
                faceapi.nets.ageGenderNet.loadFromUri('/models/modelosReconocimientoFacial'),

            ]).then(() => {
                return navigator.mediaDevices.getUserMedia({ video: {} })
                    .then(stream => {
                        console.log('Modelo cargados')
                        videoEl.srcObject = stream;
                        return Promise.resolve(videoEl);
                    })
                    .catch(err => console.error(err));
            })
        },

        apagarVideo(id) {
            const videoEl = document.getElementById(id);
            videoEl.pause();
            const stream = videoEl.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoEl.srcObject = null;
        },

        SARegistroExitoso() {
            // Use sweetalert2
            this.$swal({
                title: 'Registrado con éxito!!!',
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$router.push('/registrados');
                }
            });

        },
        SADobleRegistroLabel(label) {
            // Use sweetalert2
            this.$swal({
                title: "Usuario ya cuenta con registro",
                icon: "error",
                text: label,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    /* this.$router.push('/registrados'); */
                    this.label = ''
                }
            });
        },
        SADobleRegistroFoto(label) {
            // Use sweetalert2
            this.$swal({
                title: "Usuario ya cuenta con registro",
                icon: "error",
                text: label,
                imageUrl: `${BACKEND_URL}/uploads/img_faces/${label}.jpg`,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$router.push('/registrados');
                }
            });
        },
        SAMasRostrosDetectados() {
            // Use sweetalert2
            this.$swal({
                title: "Más de un rostro detectado",
                icon: "warning",
                text: "Procure seguir las indicaciones",
                confirmButtonText: "Seguir con el placement",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    //window.location.reload();
                }
            })

        },


        SACargandoCamara() {
            this.$swal({
                title: 'Cargando Cámara',
                didOpen: () => {
                    Swal.showLoading()
                },
                allowOutsideClick: false,
            })

        },
        SAClose() {
            this.$swal.close({})
        }

    }

}

</script>