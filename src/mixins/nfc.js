import Platforms from '@/utils/platforms'
import swal from 'sweetalert2'

export default {
  beforeDestroy () {
    if (this.nfcListenerAdded) {
      window.nfc.removeNdefListener(this.callback)
    }
  },

  data () {
    return {
      nfcListenerAdded: false,
      nfcListenerEnabled: false,
      callback: (tag) => this._initialNfcCallback(tag)
    }
  },

  computed: {
    isNfcEnabled () {
      return !!window.nfc && window.nfc.enabled
    },

    isNfcWriteEnabled () {
      return this.isNfcEnabled // && window.device.platform === Platforms.ANDROID ***testing***
    }
  },

  methods: {
    showReadyToScanModal () {
      swal({
        title: 'READY TO SCAN',
        html: '<svg version="1.1" viewBox="0 0 24 24" class="svg-icon svg-fill" style="width: 200px; height: 200px;"><path pid="0" d="M4 20h16V4H4v16z" _fill="none"></path><path pid="1" d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"></path><path pid="2" d="M0 0h24v24H0z" _fill="none"></path></svg>',
        showConfirmButton: false,
        showCancelButton: true
      }).then(({ dismiss }) => {
        if (dismiss) {
          this.pauseNfcListener()
        }
      })
    },

    checkIsNfcEnabled () {
      return !!window.nfc && window.nfc.enabled
    },

    _nfcCallback (param) {
      let value = ''
      if (param && param.tag && param.tag.ndefMessage) {
        let [{ payload }] = param.tag.ndefMessage
        value = String.fromCharCode(...payload).slice(3)
        let [id] = value.split(' - ')
        if (id) {
          value = id
        }
      }
      this.nfcCallback(value)
    },

    _initialNfcCallback (tag) {
      if (this.nfcListenerEnabled) {
        this._nfcCallback(tag)
        this.pauseNfcListener()
      }
    },

    startNfcListener (callback) {
      // let setup = () => {
      //   this.nfcListenerEnabled = true

      //   if (!this.nfcListenerAdded) {
      //     window.nfc.addNdefListener(this.callback)
      //     this.nfcListenerAdded = true
      //   }
      // }

      console.log('let\'s try this...')

      if (window.device.platform === Platforms.IOS) {
        // window.nfc.addNdefListener(() => {
        //   console.log('Listener has listened to someting')
        window.nfc.connect().then(() => {
          console.log('connection made')
          window.nfc.transceive('90 5A 00 00 03 AA AA AA 00').then(
            response => {
              console.log(response.toString())
              window.nfc.close()
            },
            (error) => console.log('Error selecting DESFire application', error)
          )
        }, (error) => { console.log('there was an error: ' + error) })
        // }, window.nfc.beginNDEFSession(), () => console.log('failed'))

        // window.nfc.beginSession(setup)
      } else {
        // setup()
      }
    },

    pauseNfcListener () {
      this.nfcListenerEnabled = false
    },

    nfcCallback () {
      // default noop callback for nfc
    }
  }
}
