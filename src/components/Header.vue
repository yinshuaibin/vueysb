<template>
    <div class="header">
        <!-- logo -->
        <div class="collapse-btn">
        </div>
        <div @click="$router.push('/home')" style="cursor:pointer" class="logo">管理系统</div>
        <el-menu
            class="sidebar-el-menu"
            mode="horizontal"
            :default-active="onRoutes"
            background-color="#242f42"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
        <div class="header-right">
            <div class="header-user-con">
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      collapse: false,
      fullscreen: false,
      name: '管理员',
      message: 0,
      items: [
        {
          icon: 'iconfont icon-zhipinku',
          index: 'title',
          title: '测试标题',
          subs: [
            {
              index: 'cosmeticsStock',
              title: '进货'
            },
            {
              index: 'cosmeticsType',
              title: '货品类型'
            }
          ]
        },
        {
          icon: 'el-icon-s-order',
          index: 'home',
          title: '主页'
        }
        // {
        //   icon: 'el-icon-s-order',
        //   index: 'OIB',
        //   title: '出入库',
        //   subs: [
        //     {
        //       index: 'rfid',
        //       title: 'RFID出入库'
        //     },
        //     {
        //       index: 'IB',
        //       title: '入库',
        //       subs: [
        //         {
        //           index: 'exWarehouseConfirm',
        //           title: '待确认入库单'
        //         },
        //         {
        //           index: 'inBom',
        //           title: '入库单查询'
        //         }
        //       ]
        //     },
        //     {
        //       index: 'OB',
        //       title: '出库',
        //       subs: [
        //         {
        //           index: 'outBomConfirmed',
        //           title: '待确认出库单'
        //         },
        //         {
        //           index: 'outBom',
        //           title: '出库单查询'
        //         }
        //       ]
        //     },
        //     {
        //       index: 'inventoryWare',
        //       title: '盘库'
        //     }
        //   ]
        // },
        // {
        //   icon: 'el-icon-s-order',
        //   index: 'ffhs',
        //   title: '演习器材',
        //   subs: [
        //     {
        //       index: 'materialIssue',
        //       title: '器材发放'
        //     },
        //     {
        //       index: 'materialRecycle',
        //       title: '器材回收'
        //     }
        //   ]
        // },
        // {
        //   icon: 'el-icon-s-order',
        //   index: 'scrap',
        //   title: '维修器材',
        //   subs: [
        //     {
        //       index: 'materialScrap',
        //       title: '器材维修'
        //     },
        //     {
        //       index: 'materialSRecycle',
        //       title: '维修归还'
        //     }
        //   ]
        // },
        // {
        //   icon: 'el-icon-s-order',
        //   index: 'systemSetting',
        //   title: '系统设置',
        //   subs: [
        //     {
        //       index: 'warehouse',
        //       title: '仓库'
        //     },
        //     {
        //       index: 'RFIDEquipment',
        //       title: 'RFID设备'
        //     },
        //     {
        //       index: 'materialModel',
        //       title: '器材类型'
        //     },
        //     {
        //       index: 'user',
        //       title: '用户管理'
        //     },
        //     {
        //       index: 'labelManagement',
        //       title: '电子标签管理'
        //     }
        //   ]
        // }
      ]
    }
  },
  computed: {
    username () {
      return this.$store.getters.getUser.userName || this.name
    },
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand (command) {
      if (command === 'loginout') {
        this.$store.commit('clearUser')
        this.$router.push('/login')
      }
    }
  },
  mounted () {}
}
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 21px;
    /* cursor: pointer; */
    line-height: 61px;
}
.header .logo {
    position: absolute;
    top: 0;
    left: 64px;
    width: 250px;
    line-height: 60px;
}
.header-right {
    position: absolute;
    right: 50px;
    top: 0;
}
.header-user-con {
    display: flex;
    height: 60px;
    align-items: center;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.sidebar-el-menu {
  position: absolute;
  width: auto;
  left:315px;
}
</style>
