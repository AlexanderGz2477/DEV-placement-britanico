<template>
    <div
        style="margin-left: 25px; margin-top: 50px; margin-right: 35px; background-color: rgba(235,0,41, 0.25); border-radius: 20px;">
        <div>
            <v-card-title class="text-h6 text-md-h5 text-lg-h4 text-center py-5" style=" font-family: 'Frutiger LT', 'Trebuchet MS', sans-serif;">Placement</v-card-title>
        </div>
        <v-row align="center" justify="center" dense>
            <!-- Temporizador -->
            <v-col cols="12" md="12" class="text-center" v-if="classifiedLevel === null">
                <p class="text-h5">Tiempo restante: {{ timer }} segundos</p>
            </v-col>
            <!-- Seguimiento de preguntas -->
            <v-col cols="12" md="12" class="text-center" v-if="classifiedLevel === null">
                <div style="display: flex; justify-content: center; gap: 10px;">
                    <div v-for="(question, index) in Array(maxQuestionsPerLevel).fill()" :key="index" :style="{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: answeredQuestions.includes(index) ? 'green' : 'gray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                    }">
                        {{ index + 1 }}
                    </div>
                </div>
            </v-col>
            <!-- Las preguntas dinámicas -->
            <v-col cols="12" md="4">
                <v-card class="px-2" rounded="lg" variant="text">
                    <!-- Si el test ha terminado, muestra el nivel clasificado -->
                    <template v-if="classifiedLevel">
                        <p class="text-h6 text-center">Test finalizado</p>
                        <p class="text-h6 text-center">
                            Tu nivel clasificado es:
                            <strong>{{ classifiedLevel }}</strong>
                            <br><br>
                            
                            <v-btn
                            color="#293896"
                            size="x-large"
                            append-icon="mdi-open-in-new"
                            variant="elevated" style="border-radius: 0.75em; font-family: 'Frutiger LT', 'Trebuchet MS', sans-serif; text-transform: none;">
                                Matricúlate ahora
                            </v-btn>
                            <br><br>
                        </p>
                    </template>
                    <template v-else-if="currentQuestion">
                        <p class="text-h6 px-8">{{ currentQuestion.question }}</p>
                        <v-card-text>
                            <!-- Renderizar preguntas dinámicamente -->
                            <v-radio-group v-model="selectedAnswer" label="Choose an option:"
                                :disabled="isQuestionAnswered">
                                <v-radio v-for="(option, index) in currentQuestion.options" :key="index" :label="option"
                                    :disabled="isQuestionAnswered" :value="option">
                                </v-radio>
                            </v-radio-group>
                            <v-btn @click="submitAnswer">Submit</v-btn>
                        </v-card-text>
                    </template>
                    <template v-else>
                        <p class="text-h6 px-8">Cargando pregunta...</p>
                    </template>
                </v-card>
            </v-col>
            <v-col cols="12" md="8" v-if="classifiedLevel === null">
                <Reconocimiento />
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import Reconocimiento from '@/components/admin/admin_placement.vue';
</script>

<script>
import axios from "axios";
import { BACKEND_URL } from '../config.js';

export default {
    data() {
        return {
            currentLevel: "Básico 1",
            previousLevel: null,
            currentQuestion: null,
            selectedAnswer: null,
            levels: [
                ...Array.from({ length: 12 }, (_, i) => `Básico ${i + 1}`),
                ...Array.from({ length: 12 }, (_, i) => `Intermedio ${i + 1}`),
                ...Array.from({ length: 6 }, (_, i) => `Avanzado ${i + 1}`),
            ],
            correctAnswers: 0,
            questionsAttempted: 0,
            maxQuestionsPerLevel: 3,
            minCorrectAnswers: 2,
            range: { low: 0, high: 29 },
            classifiedLevel: null,
            confusionLimit: 3,
            confusionCount: 0,
            timer: 30,
            interval: null,
            answeredQuestions: [],
            isQuestionAnswered: false,
        };
    },
    methods: {
        startTimer() {
            this.timer = 30; // Reinicia el temporizador para cada pregunta
            if (this.interval) clearInterval(this.interval); // Limpia intervalos anteriores
            this.interval = setInterval(() => {
                if (this.timer > 0) {
                    this.timer--;
                } else {
                    clearInterval(this.interval);
                    this.submitAnswer(true); // Si el tiempo acaba, pasa a la siguiente pregunta automáticamente
                }
            }, 1000);
        },
        async getQuestions() {
            try {
                const response = await axios.post(`${BACKEND_URL}/generate-question`, {
                    level: this.currentLevel,
                });
                this.currentQuestion = response.data;
                this.selectedAnswer = null;
                this.isQuestionAnswered = false;
                this.startTimer();
                console.log("Pregunta obtenida: ", response.data);
            } catch (error) {
                console.error("Error al obtener la pregunta:", error);
            }
        },
        submitAnswer(isTimeOut = false) {
            if (this.currentQuestion && !this.isQuestionAnswered) {
                this.isQuestionAnswered = true; // Bloquea las opciones
                this.answeredQuestions.push(this.questionsAttempted); // Marca la pregunta como contestada

                // Si el usuario no seleccionó respuesta, cuenta como incorrecta
                if (!isTimeOut && this.selectedAnswer === this.currentQuestion.answer) {
                    this.correctAnswers++;
                }

                // Avanza de nivel o carga una nueva pregunta
                setTimeout(() => {
                    this.questionsAttempted++;

                    if (this.questionsAttempted >= this.maxQuestionsPerLevel) {
                        clearInterval(this.interval);
                        this.evaluateLevelProgressBinary();
                    } else {
                        //this.isQuestionAnswered = false; // Desbloquea para la siguiente pregunta
                        this.getQuestions(); // Obtiene la siguiente pregunta
                    }
                }, 1500); // Retardo opcional para que el usuario vea su selección antes de cambiar de pregunta
            }
        },
        evaluateLevelProgressBinary() {
            if (this.correctAnswers >= this.minCorrectAnswers) {
                this.adjustRange(true);
            } else {
                this.adjustRange(false);
            }
        },
        adjustRange(success) {
            const currentIndex = this.levels.indexOf(this.currentLevel);

            if (success) {
                this.range.low = currentIndex + 1;
            } else {
                this.range.high = currentIndex - 1;
            }

            if (this.range.low > this.range.high) {
                this.classifyUser();
                return;
            }

            const midIndex = Math.floor((this.range.low + this.range.high) / 2);
            this.previousLevel = this.currentLevel;
            this.currentLevel = this.levels[midIndex];

            this.resetLevelProgress();
            this.getQuestions();
        },
        classifyUser() {
            this.classifiedLevel = this.currentLevel;
            //alert(`Tu nivel clasificado es: ${this.classifiedLevel}`);
        },
        resetLevelProgress() {
            this.correctAnswers = 0;
            this.questionsAttempted = 0;
            //this.selectedAnswer = null;
            this.answeredQuestions = [];
            this.isQuestionAnswered = false;
        }
    },
    mounted() {
        this.getQuestions();
    },
    beforeDestroy() {
        if (this.interval) clearInterval(this.interval);
    },
};
</script>