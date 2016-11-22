var vm = new Vue({
  el: '#app',
  data: {
    udata: null,
    loaded: true,
    test: 'asdfafdasfsa'
  },
  created: function () {
  },
  methods: {
    team: function (scale) {
      switch (scale) {
        case 0:
          return '<10人'
        case 1:
          return '10-50人'
        case 2:
          return '50-100人'
        case 3:
          return '>100人'
      }
    },
    fund: function (scale) {
      switch (scale) {
        case 0:
          return 'preA'
        case 1:
          return 'A'
        case 2:
          return 'B'
        case 3:
          return 'C'
        case 4:
          return '其它'
      }
    }
  }
})

$.ajax({
  type: 'get',
  url: 'http://192.168.100.200:9090/enroll_user',
  async: false,
  success: function (data) {
    console.log(data.data)
    vm.udata = data.data
    vm.loaded = false
  }
})
