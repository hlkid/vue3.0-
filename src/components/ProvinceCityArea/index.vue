<template>
  <div class="district-content">
    <el-select
      v-model="province"
      filterable
      placeholder="省"
      class="district"
      @change="changeProvince"
      :disabled="isDisabled"
    >
      <el-option
        v-for="item in provinceList"
        :key="'province'+item.id"
        :label="item.districtName"
        :value="item.id"
      ></el-option>
    </el-select>
    <el-select
      v-model="city"
      filterable
      placeholder="市"
      class="district"
      @change="changeCity"
      :disabled="isDisabled"
    >
      <el-option
        v-for="item in cityList"
        :key="'city'+item.id"
        :label="item.districtName"
        :value="item.id"
      ></el-option>
    </el-select>
    <el-select
      v-model="area"
      filterable
      placeholder="区/县"
      class="district"
      @change="changeArea"
      :disabled="isDisabled"
    >
      <el-option
        v-for="item in areaList"
        :key="'area'+item.id"
        :label="item.districtName"
        :value="item.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { districtParentData, districtChildData } from "@/api/config.js";
export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    districtCode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      mergerCode: "", // 省市区的行政编码拼接
      mergerName: "", // 省市区的行政名称拼接
      province: "",
      city: "",
      area: "",
      provinceList: [],
      cityList: [],
      areaList: []
    };
  },
  watch: {
    districtCode(n, o) {
      // n.split(",").length === 3 ? n.split(",") : ["", "", ""];
      let districtCode = n.split(",");
      this.province = districtCode[0] ? String(districtCode[0]) : "";
      this.city = districtCode[1] ? String(districtCode[1]) : "";
      this.area = districtCode[2] ? String(districtCode[2]) : "";

      this.cityList = [];
      this.areaList = [];
      this.districtChildData(this.province, this.cityList);
      this.districtChildData(this.city, this.areaList);
    }
  },
  methods: {
    changeProvince(val) {
      this.city = "";
      this.cityList = [];
      this.area = "";
      this.areaList = [];
      this.districtChildData(val, this.cityList);

      this.mergerCode = [this.province].toString();
      this.provinceList.forEach(item => {
        if (val === item.id) {
          this.mergerName = item.mergerName;
        }
      });

      this.$emit("receiveProvinceEvent", {
        mergerCode: this.mergerCode,
        mergerName: this.mergerName
      });
    },
    changeCity(val) {
      this.area = "";
      this.areaList = [];
      this.districtChildData(val, this.areaList);

      this.mergerCode = [this.province, this.city].toString();

      this.cityList.forEach(item => {
        if (val === item.id) {
          this.mergerName = item.mergerName;
        }
      });
      this.$emit("receiveCityEvent", {
        mergerCode: this.mergerCode,
        mergerName: this.mergerName
      });
    },
    changeArea(val) {
      this.mergerCode = [this.province, this.city, this.area].toString();
      this.areaList.forEach(item => {
        if (val === item.id) {
          this.mergerName = item.mergerName;
        }
      });

      this.$emit("receiveEvent", {
        mergerCode: this.mergerCode,
        mergerName: this.mergerName
      });
    },
    //省级区域
    districtParentData() {
      districtParentData().then(res => {
        if (res.code == 200) {
          this.provinceList = res.data;
        }
      });
    },
    //省级子级区域
    districtChildData(parentId, arr = []) {
      districtChildData(parentId).then(res => {
        if (res.code == 200) {
          res.data.forEach(item => {
            arr.push(item);
          });
        }
      });
    }
  },
  created() {
    this.provinceList = [];
    this.districtParentData();
  }
};
</script>

<style lang="scss" scoped>
.district-content {
  width: 100%;
  display: flex;
  .district {
    flex: 1;
  }
}
</style>
