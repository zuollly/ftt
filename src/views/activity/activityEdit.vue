<template>
  <div class="addActivity">
    <el-card class="box-card">
      <!-- <LayBreadcrumb></LayBreadcrumb> -->
      <!-- <hr> -->
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="活动主题" required>
          <el-col :span="12">
           <el-input v-model="form.name" placeholder='请输入活动主题, 30字以内' maxlength="30" style="maxWidth: 440px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="12" class="time">
          <el-col :span="12">
            <el-date-picker type="date" class="startTime" placeholder="请选择开始日期" v-model="form.startTime" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
          </el-col>
          <el-col :span="12">
            <el-date-picker type="date" class="endTime" placeholder="请选择结束日期" v-model="form.endTime" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
          </el-col>
          </el-col>
        </el-form-item>
        <el-form-item label="邀请成员">
          <el-col :span="12" class="shoperBox">
          <el-popover
            placement="top-start"
            title="邀请的成员"
            width="300"
            trigger="hover"
            :content="invitePersonString ? invitePersonString : '还未邀请任何坊外成员'">
            <el-input  slot="reference" v-model="invitePersonString"  @click.native="openChoose" readonly placeholder='请选择成员' class='shoper'></el-input>
            <svg-icon  slot="reference" :iconClass='"admin"' class="admin"></svg-icon>
          </el-popover>
          <p class="tip">提示: 坊内成员默认就可以参加活动，邀请是邀请坊外成员</p>
          </el-col>
        </el-form-item>
        <el-form-item label="活动描述">
          <el-col :span="16">
            <tinymce :value='form.description' v-model="form.description" :height="200"></tinymce>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="publish">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
      <choosePerson :choosePersonTitle="choosePersonTitle" :groupId='groupId' v-if="chooseVisible" @closeChoose='closeChoose' :isSingle="'multiple'" :checkedPersonId='invitePersonId'></choosePerson>
    </el-card>
  </div>
</template>

<script>
// import { editActivity, ActivityInfo, ActivityPerson } from '@/api/activity'
export default {
  name: 'AddActivity',
  components: {
    tinymce: () => import('@/components/tinymce'),
    choosePerson: () => import('@/modules/choosePerson'),
    LayBreadcrumb: () => import('@/components/LayBreadcrumb')
  },
  data() {
    return {
      form: {
        name: '',
        startTime: '',
        endTime: '',
        description: ''
      },
      groupId: this.$route.params.id,
      invitePerson: [], // array
      chooseVisible: false,
      choosePersonTitle: '邀请成员'
    }
  },
  mounted() {
  },
  computed: {
    invitePersonString() {
      if (!this.invitePerson || this.invitePerson.length === 0) return ''
      return this.invitePerson.map(el => { return el.name }).join(' ')
    },
    invitePersonId() {
      if (!this.invitePerson || this.invitePerson.length === 0) return []
      return this.invitePerson.map(el => {
        return el.id
      })
    }
  }
}
</script>

<style scoped lang="scss">
.addActivity {
  .shoper {
    max-width: 440px;
    /deep/ .el-input__inner {
      cursor: pointer;
      padding-right: 30px;
    }
  }
  .shoperBox {
    position: relative;
    max-width: 440px;
    .admin {
      transform: translateY(-50%);
      position: absolute;
      right: 11px;
      top: 20px;
    }
  }
  .tip {
    color: #999;
  }
  .time {
    max-width: 440px;
    .startTime {
      width: 99%;
      margin-right: 2%;
    }
    .endTime {
      width: 99%;
    }
  }
}
</style>
