<template>
<div class='page-prediction'>
  <p class='judul'>Auto Prediction News By Date</p>

  <div class="container content-prediction">
    <div class="sisi-kiri">
      <p>Pilih Tanggal</p>
      <datepicker
        v-model="date" 
        value-type="format" 
        format="YYYY-MM-DD"
        :upperLimit="tomorrow"
        style="
          box-sizing: border-box;
          padding: 5px;
          width: 100%; 
          color: #555;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
          height: 34px;
          padding: 6px 30px;
          padding-left: 10px;
        "
        >
      </datepicker>
      <p>Jumlah Berita</p>
      <div class="jml-berita">
        <input type="text" name="jml-berita" v-model="limit" @keyup.enter="getPredictByDate">
      </div>
      <div class="btn-kiri">
        <input 
          type="button" 
          class="btn-run" 
          value="Run"
          @click="getPredictByDate"
        >
        <input 
          type="button" 
          class="btn-reset" 
          value="Reset"
          @click="resetData"
        >
      </div>
    </div>
    <div class="sisi-tengah">
      <p class="judul-tengah">Berita Terkait</p>
      <!-- <div class="card">
        <div class="card-media">
          <span class="icon-media">
            <i class="fas fa-user-edit fa-sm"></i>
          </span>
          <p>Kontan</p>
        </div>
        <p class="card-judul">KPK Hari ini Dimatikan</p>
        <div class="card-bottom">
          <div class="card-pubday">
            <span class="icon-clock">
              <i class="far fa-clock fa-sm"></i>
            </span>
            <p>2021-06-02</p>
          </div>
          <a class="card-link" href="https://google.com" target="_blank">
            <span>
              <i class="fas fa-link"></i>
            </span>
            <p>Source link</p>
          </a>
        </div>
      </div> -->
      <div class="loading" v-if="loading === true">
        <beat-loader :loading="loading" :color="color"></beat-loader>
      </div>
      <div v-else>
        <div v-if="predict.data" class="list-berita">
          <div v-for="(news, idx) in predict.data.news" :key="idx">
            <div 
              class="card"
              @click="showClikedNer(idx)"
            >
              <div class="card-media">
                <span class="icon-media">
                  <i class="fas fa-user-edit fa-sm"></i>
                </span>
                <p>{{ news.media }}</p>
              </div>
              <p class="card-judul">{{ news.title }}</p>
              <div class="card-bottom">
                <div class="card-pubday">
                  <span class="icon-clock">
                    <i class="far fa-clock fa-sm"></i>
                  </span>
                  <p>{{ news.pubday }}</p>
                </div>
                <a class="card-link" :href="news.url" target="_blank">
                  <span>
                    <i class="fas fa-link"></i>
                  </span>
                  <p>Source link</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p style="font-size:14px; text-align:center; padding-top:40px;"><i>pilih tanggal, tentukan jumlah berita lalu klik run</i></p>
        </div>
      </div>
    </div>
    <div class="sisi-kanan">
      <p class="judul-hasil">Hasil Prediksi <i>Name Entity Recognation</i></p>
      <div class="result-prediction">
        <div class="loading" v-if="loading === true">
          <beat-loader :loading="loading" :color="color"></beat-loader>
        </div>
        <div v-else>
          <div v-if="predict.data" class="vue-toggle">
            <Toggle class="btn-toggle" v-model="toggleValue" on-label="Judul" off-label="Konten"/>
          </div>
          <table v-if="predict.data" class="table-hasil">
            <tr>
              <th class="name">Kata</th>
              <th class="value">Tag</th>
            </tr>
            <div class="div-table-hasil">
              <div v-if="toggleValue" >
                <div v-for="(d, index) in predict.data.news[idx_result].ner_title" v-bind:key="index">
                  <tr v-if="d.tag != 'O'">
                    <!-- <div> -->
                      <td class="name">
                        {{ d.word }}
                      </td>
                      <td class="value">
                        {{ d.tag != 'O' ? d.tag.split("-")[1] : '-' }}
                      </td>
                    <!-- </div> -->
                  </tr>
                </div>
              </div>
              <div v-else >
                <div v-for="(d, index) in predict.data.news[idx_result].ner_content" v-bind:key="index">
                  <tr v-if="d.tag != 'O'">
                    <!-- <div> -->
                      <td class="name">
                        {{ d.word }}
                      </td>
                      <td class="value">
                        {{ d.tag != 'O' ? d.tag.split("-")[1] : '-' }}
                      </td>
                    <!-- </div> -->
                  </tr>
                </div>
              </div>
            </div>
          </table>
          <p  v-else-if="!predict.data" style="font-size:14px; text-align:center; padding-top:50px;"><i>belum memilih berita</i></p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import Datepicker from 'vue3-datepicker'
import { add } from 'date-fns'
import Toggle from '@vueform/toggle'

export default {
  name: "dateprediction",
  components: {
    BeatLoader,
    Datepicker,
    Toggle
  },
  data () {
    return {
      predict: {},
      idx_result: 0,
      inputan: '',
      loading: false,
      color: '#1B2B47',
      date: new Date(), //.toISOString().split('T')[0],
      pickedDate: '',
      newsByDate: null,
      limit: 10,
      tomorrow: add(new Date(),{days: 0 }),
      toggleValue: true
    }
  },
  methods: {
    resetData () {
      this.predict = {}
      this.limit = 10
      this.date = new Date() //.toISOString().split('T')[0]
    },
    showClikedNer (idx) {
      this.idx_result = idx
    },
    getPredictByDate () {
      this.loading = true
      this.pickedDate = this.date.toISOString().split('T')[0],
      this.predict = this.getPredictionFromBackend()
    },
    getPredictionFromBackend () {
      const path = `http://192.168.75.145:5000/api/predict-by-date`
      return axios.get(path, {
        params: {
          tgl: this.pickedDate,
          limit: this.limit
        }
      })
      .then(response => {
        // this.predict = JSON.parse(JSON.stringify(response.data))
        this.predict = response.data
        console.log(response.data)
        this.loading = false
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style src="@vueform/toggle/themes/default.css"></style>
<style scoped>
/* Global */
.page-prediction {
  width: 90%;
  padding: 20px 5%;
}

.judul {
  margin-top: 0px;
  padding: 30px 0px;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
}

.page-prediction .content-prediction {
  box-sizing: border-box;
  display: flex;
}

.loading {
  text-align: center;
  padding-top: 40px;
}

/* ========= */

.sisi-tengah,
.sisi-kanan {
  box-sizing: border-box;
}

.sisi-kanan p, 
.sisi-tengah .judul-tengah {
  margin-top: 0;
  text-align: left;
}

/* SISI KIRI */
.sisi-kiri {
  box-sizing: border-box;
  width: 20%;
  margin-right: 20px;
  height: 400px;
  text-align: center;
}

.sisi-kiri p {
  text-align: left;
}

.v3dp__datepicker {
  --vdp-bg-color: #ffffff;
  --vdp-text-color: #000000;
  --vdp-box-shadow: 0 4px 10px 0 rgba(128, 144, 160, 0.1), 0 0 1px 0 rgba(128, 144, 160, 0.81);
  --vdp-border-radius: 3px;
  --vdp-heading-size: 2.5em;
  --vdp-heading-weight: bold;
  --vdp-heading-hover-color: #eeeeee;
  --vdp-arrow-color: currentColor;
  --vdp-elem-color: currentColor;
  --vdp-disabled-color: #d5d9e0;
  --vdp-hover-color: #ffffff;
  --vdp-hover-bg-color: #1B2B47;
  --vdp-selected-color: #ffffff;
  --vdp-selected-bg-color: #006eff;
  --vdp-elem-font-size: 0.9em;
  --vdp-elem-border-radius: 3px;
  --vdp-divider-color: #1B2B47;
}


.jml-berita input {
  box-sizing: border-box;
  padding: 5px;
  width: 100%; 
  color: #555;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
  height: 34px;
  padding: 6px 30px;
  padding-left: 10px;
}

.btn-kiri {
  margin-top: 20px;
}

.btn-run,
.btn-reset {
  width: 48%; 
  padding: 10px;
  cursor: pointer;
  margin: 1%;
}

.btn-run {
  background-color: #1B2B47;
  border-color: #1B2B47;
  color: white;
  border-radius: 3px;
}

.btn-run:hover {
  background-color: #284069;
  border-color: #284069;
  border-radius: 3px;
}

.btn-reset {
  background-color: white;
  border-color: #1B2B47;
  color: #1B2B47;
  border-radius: 3px;
}

.btn-reset:hover {
  background-color: #D1E3EF;
}
/* ============= */

/* SISI TENGAAH */
.sisi-tengah {
  padding: 20px 20px;
  width: 40%;
  height: 600px;
}

.judul-tengah {
  margin-bottom: 10px !important;
}

.list-berita {
  padding-right: 20px;
  height: 700px;
  overflow: auto;
}

.card {
  background-color: #f8f8f8;
  padding: 25px;
  margin-bottom: 5px;
  border-radius: 10px;
}

.card p {
  margin: 0;
}

.card-judul {
  font-size: 18px;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
}

.card-media {
  text-align: left;
  margin-bottom: 10px;
}

.card-media .icon-media {
  padding-right: 2px;
}

.card-media p {
  display: inline-block;
}

.card-bottom {
  margin-top: 5px;
  margin-bottom: 20px;
}

.card-pubday {
  float: left;
  width: 50%;
  text-align: left;
}

.card-pubday .icon-clock {
  font-size: 15px;
  padding-right: 2px;
}

.card-pubday p {
  font-size: 12px;
  display: inline-block;
}

.card-link {
  float: right;
  width: 50%;
  text-align: right;
}

.card-link p {
  display: inline-block;
  font-size: 12px;
}

.card-link span {
  font-size: 10px;
}

a {
  color: #1B2B47;
}

/* ============= */


/* SISI KANAN - HASIL */
.sisi-kanan {
  padding: 20px;
  width: 35%;
  margin-left: 10px;
  height: 600px;
}

.judul-hasil {
  padding-left: 5px;
  text-align: left;
  margin-bottom: 0px;
}

.vue-toggle {
  display: flex;
  /* height: inherit; */
  justify-content: flex-start;
  margin-top: 20px;
}

.btn-toggle {
  --toggle-width: 7rem;
  --toggle-height: 2rem;
  --toggle-border: 0.2rem;
  --toggle-font-size: 0.85rem;
  --toggle-duration: 200ms;
  --toggle-bg-on: #1B2B47;
  --toggle-bg-off: #e5e7eb;
  --toggle-bg-on-disabled: #d1d5db;
  --toggle-bg-off-disabled: #e5e7eb;
  --toggle-border-on: #1B2B47;
  --toggle-border-off: #e5e7eb;
  --toggle-border-on-disabled: #d1d5db;
  --toggle-border-off-disabled: #e5e7eb;
  --toggle-text-on: #ffffff;
  --toggle-text-off: #1B2B47;
  --toggle-text-on-disabled: #9ca3af;
  --toggle-text-off-disabled: #9ca3af;
  --toggle-handle-enabled: #ffffff;
  --toggle-handle-disabled: #f3f4f6;
  --toggle-handle-width: 40px;
}


.switch-btn button {
  width: 49%;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #1B2B47;
  border-radius: 3px;
} 


/* .result-prediction {
  height: 400px;
  overflow: auto;
} */

.div-table-hasil {
  height: 500px;
  overflow: auto;
}

.table-hasil {
  box-sizing: border-box;
  display: inline-block;
  width: 100%;
  border-collapse: collapse;
}

.table-hasil tr {
  box-sizing: border-box;
  margin: 0;
  width: 100%;
  display: block;
}

.table-hasil th.idx,
.table-hasil th.name,
.table-hasil th.value {
  text-align: center;
  margin-bottom: 10px;
  margin-top: 20px;
}

.table-hasil td,
.table-hasil th {
  margin-bottom: 3px;
  box-sizing: border-box;
  padding: 3px 5px;
  display: inline-block;
  text-align: left;
}

.table-hasil td.idx,
.table-hasil th.idx {
  width: 10%;
}

.table-hasil td.idx {
  text-align: center;
}

.table-hasil td.name,
.table-hasil th.name {
  width: 49%;
}

.table-hasil td.value,
.table-hasil th.value {
  width: 49%;
}

.table-hasil td.name {
  box-sizing: border-box;
  border: 1px solid #1B2B47;
}

.table-hasil td.value {
  background-color: #1B2B47;
  border: 1px solid #1B2B47;
  color: white;
}

/* ============= */
</style>
