<template>
  <a :href="authUrl" class="mx-auto">
    <img :src="googleLogo" alt="Google login" class="" />
  </a>
</template>

<script setup lang="ts">
import googleLogo from '@/assets/icons/web_neutral_sq_ctn.svg'

const authUrl = `${__API_URL__}/api/auth/google`
</script>
