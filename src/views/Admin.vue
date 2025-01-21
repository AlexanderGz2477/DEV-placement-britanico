<template>
    <div
        style="margin-left: 25px; margin-top: 50px;margin-right: 35px; background-color: rgba(235,0,41, 0.25); border-radius: 20px; ">
        <div>
            <v-card-title class="text-h6 text-md-h5 text-lg-h4 text-center py-2">Placement</v-card-title>
        </div>
        <v-row align="center" justify="center" dense>
            <!-- Las preguntas dinámicas -->
            <v-col cols="12" md="4">
                <v-card class="px-2" rounded="lg" variant="text">
                    <template v-if="currentQuestion">
                        <p class="text-h6 px-8"> {{ currentQuestion.question }}</p>
                        <v-card-text>
                            <!-- Renderizar preguntas dinámicamente -->
                            <v-radio-group v-model="selectedAnswer" label="Seleccione una opción:">
                                <v-radio v-for="(option, index) in currentQuestion.options" :key="index" :label="option"
                                    :value="option">
                                </v-radio>
                            </v-radio-group>
                            <v-btn @click="handleAnswer">Submit</v-btn>
                        </v-card-text>
                    </template>
                    <template v-else>
                        <p class="text-h6 px-8">Cargando pregunta...</p>
                    </template>
                </v-card>
            </v-col>
            <v-col cols="12" md="8">
                <Reconocimiento />
            </v-col>
        </v-row>

    </div>
</template>
<script setup>
import Reconocimiento from '@/components/admin/admin_placement.vue'
</script>
<script>
import axios from "axios";
import { BACKEND_URL } from '../config.js';
export default {
    data() {
        return {
            currentLevel: "Básico 1",
            currentQuestion: null,
            selectedAnswer: null,

        };
    },
    methods: {
        async getQuestions() {
            try {

                const response = await axios.post(`${BACKEND_URL}/generate-question`, {
                    level: this.currentLevel,
                });
                this.currentQuestion = response.data;
                console.log("Pregunta obtenida: ", response.data)
                this.selectedAnswer = null;
            } catch (error) {
                console.error("Error get questions:", error);
            }
        },
        handleAnswer() {
            if (this.selectedAnswer === this.currentQuestion.answer) {
                alert("¡Correcto!");
                this.advanceLevel();
            } else {
                alert("Respuesta incorrecta. Intenta de nuevo.");
            }
        },
        advanceLevel() {
            const levels = [
                ...Array.from({ length: 12 }, (_, i) => `Básico ${i + 1}`),
                ...Array.from({ length: 12 }, (_, i) => `Intermedio ${i + 1}`),
                ...Array.from({ length: 6 }, (_, i) => `Avanzado ${i + 1}`),
            ];

            const currentIndex = levels.indexOf(this.currentLevel);
            if (currentIndex !== -1 && currentIndex < levels.length - 1) {
                this.currentLevel = levels[currentIndex + 1];
                this.getQuestions();
            } else {
                alert("¡Has completado todos los niveles!");
            }
        },
    },
    mounted() {
        this.getQuestions();
    },
}
</script>