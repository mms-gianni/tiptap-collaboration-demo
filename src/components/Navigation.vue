<template>
    <mdb-navbar color="grey" class=" lighten-4 py-4">
      <mdb-navbar-nav nav left>
        <mdb-nav-item href="https://github.com">Soucre code</mdb-nav-item>
        <mdb-nav-item href="#">Link</mdb-nav-item>
        <mdb-nav-item href="#">Link</mdb-nav-item>
        <mdb-nav-item href="#" disabled>Disabled</mdb-nav-item>
      </mdb-navbar-nav>
    </mdb-navbar>
</template>

<script>
import { mdbNavbar, mdbNavbarNav, mdbNavItem } from 'mdbvue';
export default {
  name: 'Navigation',
  components: {
    mdbNavbar,
    mdbNavbarNav,
    mdbNavItem
  },

  props: {
    msg: String
  },
}
</script>


</style>
