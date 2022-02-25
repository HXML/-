<template>
  <div id="crumbs">
    <ul >
      <li
        v-for="(item, index) in message.stepList"
        :class="index===message.index?'active':''||index<message.index?'executed':''"
        :key="index"
      >
        <a>{{item}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["message"]
};
</script>
<style type="text/css">
#crumbs {
  display: flex;
  text-align: center;
}
#crumbs ul {
  list-style: none;
  display: inline-table;
}
#crumbs ul li {
  display: inline;
}
#crumbs ul li a {
  display: block;
  float: left;
  height: 40px;
  min-width: 180px;
  line-height: 40px;
  text-align: center;
  background: #e8e8e8;
  text-align: center;
  padding: 0px 10px 0 20px;
  position: relative;
  margin-right: 15px;
  text-decoration: none;
  color: #7d828f;
}
#crumbs ul li a:after {
  content: "";
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid #e8e8e8;
  position: absolute;
  right: -20px;
  top: 0;
  z-index: 1;
}
.active a {
  color: #e8e8e8 !important;
  background: #e46d0c !important;
}
.active a:after {
  border-left-color: #e46d0c !important;
}
.executed a {
  color: #e46d0c !important;
  background: rgba(228, 109, 12, 0.1) !important;
}
.executed a:after {
  border-left-color: rgba(228, 109, 12, 0.1) !important;
}

#crumbs ul li a:before {
  content: "";
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid #ffffff;
  position: absolute;
  left: 0;
  top: 0;
}
#crumbs ul li:first-child a:before {
  display: none;
}
#crumbs ul li:last-child a:after {
  display: none;
}
</style>