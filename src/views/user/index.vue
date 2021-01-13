<template>
  <div class="index">
    <div class="loginCard">
      <div class="loginBox">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.index {
  width: 100%;
  height: 100vh;
  background: #656ee8;
  position: relative;
}

.loginCard {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 520px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 0px 12px #6a6a6a;
}

.loginBox {
  width: 900px;
  height: 520px;
  position: relative;
}


</style>
