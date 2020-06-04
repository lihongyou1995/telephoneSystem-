export default {
    name: 'unitmanagement',
    data() {
        return {
            ifdisable: 0,
            exporyUrl: '',
            importurl: '',
            paramsData: {
                userId: sessionStorage.getItem('userID'),
            },
            antirepeatclick: false,  // 防重复点击
            valueId: this.value,    // 初始值
            valueTitle: '',
            defaultExpandedKey: [],
            filterText: '',
            filterText1: '',
            filterText2: '',
            filterText3: '',
            defaultnodename: '', // 默认选择的节点
            dialogFormVisible: false,
            titletxet: '新增单位',
            formLabelWidth: '80',
            UnitTypeIndex: '',
            isAdd: true,
            treedata: [], // 单位
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            Unittype: [], // 单位类型
            defaultProps2: {
                children: 'children',
                label: 'categoryName'
            },
            Unitlevel: [], // 单位级别
            defaultProps3: {
                children: 'children',
                label: 'levelName'
            },
            Unitattribute: [], // 单位属性
            defaultProps4: {
                children: 'children',
                label: 'name'
            },
            addways: '下级',
            // 新增单位数据
            addForm: {
                unitId: '',
                pid: '',
                pname: '',
                levels: '',
                superiorubit: '', // 上级单位
                addways: '', // 新增方式
                unitname: '', // 单位名称
                unitcode: '', // 单位代号
                superiorunit: '', // 单位属性
                unitlevel: '', // 单位级别
                unitattribute: '', // 单位类型
                unitresident: '', // 单位驻地
                DutyRoomTelephone: '', // 值班室电话
                unitlevelId: '',  // 级别
                superiorunitId: '',  // 属性
                unitattributeId: '', // 类型
                shangjiid: '', // 上级id
                xiajiid: '', // 下级id
            },
            // 单位详细信息
            unitInfo: {
                companyunit: '', // 上级单位
                unitname: '', // 单位名称
                superiorunit: '', // 单位属性
                unitlevel: '', // 单位级别
                unitattribute: '', // 单位类别
                DutyRoomTelephone: '', // 值班室电话
                unitcode: '', // 单位代号
                unitresident: '', // 单位驻地
            },
            value: [],
            list: [],
            options: [],
            lishidata: '',
            roleId: sessionStorage.getItem("roleId"),
            userId: sessionStorage.getItem("userID"),
            unitId: sessionStorage.getItem("unitId"),
            isconfirm: 0,
            verification: false,
        }
    },
    methods: {
        // 新增/编辑时验证信息是否完整
        verificationInfo() {
            this.verification = false;
            if (this.addForm.unitname === '') return this.$message('请填写单位名称');
            if (this.addForm.unitcode === '') return this.$message('请填写单位代号');
            if (this.addForm.unitlevel === '') return this.$message('请选择单位级别');
            if (this.addForm.superiorunit === '') return this.$message('请选择单位属性');
            if (this.addForm.unitattribute === '') return this.$message('请选择单位类型');
            if (this.addForm.DutyRoomTelephone === '') return this.$message('请填写值班室电话');
            if (this.addForm.unitresident === '') return this.$message('请填写单位驻地');
            this.verification = true;
        },
        // 导出单位
        exportExcelData() {
            window.open(`${this.exporyUrl}/dev/unit/export?ownUnitId=${this.userId}`)
        },
        // 导入单位
        handleChange(file) {
            let _this = this;
            const loading = this.openLoading();
            this.isconfirm++;
            console.log(this.isconfirm)
            if (this.isconfirm == 1) return;
            if (this.isconfirm == 2) {
                this.isconfirm = 0;
                loading.close();
                setTimeout(function () {
                    console.log(file)
                    if (file.response.code == 200) {
                        _this.getCompany()
                        _this.$message.success('导入成功')
                    } else {
                        _this.$message(file.response.message)
                    }
                }, 0)
                // this.$confirm('导入单位将清空所有数据，请谨慎操作，是否继续导入？', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                //     }).then(() => {
                //         console.log(file.response.code)


                //     }).catch(() => {

                // });
            }
        },

        // 查询单位架构
        getCompany() {
            this.$http.queryTree({
                userid: sessionStorage.getItem('userID'),
                roleid: sessionStorage.getItem('roleId'),
                unitID: sessionStorage.getItem('unitId')
            }).then(res => {
                console.log(res)
                console.log(res.data)
                if (res.data) {
                    this.treedata = res.data;
                }

            })
        },
        // 单位架构 详细信息
        handleNodeClick(data) {
            let _this = this;
            this.lishidata = data,
            console.log("---- -----"+data.id)
                console.log("选择单位" + this.lishidata);
            if (data.id == sessionStorage.getItem('unitId')) {
                this.addways='下级'
                this.ifdisable = 1
                console.log("是否禁用" + this.ifdisable)
                console.log("unitid" + sessionStorage.getItem('unitId'))
            } else {
                this.ifdisable = 0
                console.log("是否禁用" + this.ifdisable)
            }
            if (this.lishidata) {
                this.defaultnodename = this.lishidata.name;
                _this.addForm.shangjiid = this.lishidata.pid;
                _this.addForm.xiajiid = this.lishidata.id;
                _this.addForm.pname = this.lishidata.name;
                _this.addForm.levels = this.lishidata.levels + 1;
                console.log(_this.addForm.shangjiid)

            }
            this.unitInfofn();
        },

        // 获取详细信息
        unitInfofn() {
            this.$http.unitInfo('/unit/' + this.addForm.xiajiid).then(res => {
                console.log(res)
                this.addForm.pid = res.data.pid;
                this.addForm.superiorubit = res.data.unitName;
                this.unitInfo.companyunit = res.data.pName;
                this.unitInfo.unitattribute = res.data.categoryName;
                this.unitInfo.superiorunit = res.data.propertyName;
                this.unitInfo.unitname = res.data.unitName;
                this.unitInfo.unitlevel = res.data.unitLevel;
                this.unitInfo.DutyRoomTelephone = res.data.dutyPhone;
                this.unitInfo.unitcode = res.data.unitAlias;
                this.unitInfo.unitresident = res.data.unitAddress;
            })
        },
        // 新增单位提交
        confirmAdd() {
            if (this.addways == "同级(向下插入)") {
                this.addForm.unitId = this.addForm.shangjiid;
                if (!this.addForm.shangjiid) {
                    this.addForm.unitId = this.addForm.xiajiid;
                }
                console.log(this.addForm.unitId)
            } else if (this.addways == "下级") {
                this.addForm.levels = '';
                this.addForm.unitId = this.addForm.xiajiid;
                console.log(this.addForm.unitId)
            } else if (this.addways == "同级(向上插入)") {
                let levelaa = this.addForm.levels - 2;
                if (levelaa < 0) {
                    levelaa = 0
                }
                this.addForm.levels = levelaa
                this.addForm.unitId = this.addForm.shangjiid;
                if (!this.addForm.shangjiid) {
                    this.addForm.unitId = this.addForm.xiajiid;
                }
            }

            if (this.isAdd) {
                this.verificationInfo();
                if (!this.verification) return false;
                this.dialogFormVisible = false;
                this.antirepeatclick = true;
                this.$http.addData({
                    pid: this.addForm.unitId,
                    levels: this.addForm.levels,
                    pName: this.addForm.pname,
                    unitName: this.addForm.unitname,
                    dutyPhone: this.addForm.DutyRoomTelephone,
                    unitAddress: this.addForm.unitresident,
                    unitAlias: this.addForm.unitcode,
                    levelName: this.addForm.unitlevel,
                    propertyName: this.addForm.superiorunit,
                    categoryName: this.addForm.unitattribute,
                    userId: this.userId,
                }).then(res => {
                    console.log(res)
                    this.antirepeatclick = false;
                    this.getCompany(); // 查询单位
                    return res.code == 200 ? this.$message.success('新增成功') : this.$message(res.data || res.message);
                })
            } else {
                this.verificationInfo();
                if (!this.verification) return false;
                this.antirepeatclick = true;
                this.dialogFormVisible = false;
                this.$http.editunitpost({
                    pid: this.addForm.pid,
                    unitId: this.addForm.xiajiid,
                    unitName: this.addForm.unitname,
                    dutyPhone: this.addForm.DutyRoomTelephone,
                    propertyName: this.addForm.superiorunit,
                    levelName: this.addForm.unitlevel,
                    unitAddress: this.addForm.unitresident,
                    unitAlias: this.addForm.unitcode,
                    categoryName: this.addForm.unitattribute,
                }).then(res => {
                    console.log(res)
                    this.antirepeatclick = false;
                    if (res.code == 200) {
                        this.handleNodeClick(this.lishidata);
                        this.$message.success('修改成功')
                        this.getCompany();
                    } else {
                        this.$message(res.data)
                    }
                })
            }

        },
        // 新增按钮
        addunit() {

            console.log(this.treedata)
            if (!this.lishidata.pid) {
                this.addForm.levels = '';
                this.addForm.unitId = this.addForm.xiajiid;
            }
            if (this.treedata.length > 0) {
                if (this.addForm.superiorubit != '') {
                    this.titletxet = '新增单位'
                    this.dialogFormVisible = true;
                    this.isAdd = true;
                    this.addForm.addways = '';// 新增方式
                    this.addForm.unitname = '';// 单位名称
                    this.addForm.unitcode = '';// 单位代号
                    this.addForm.superiorunit = ''; // 单位级别
                    this.addForm.unitlevel = '';// 单位属性
                    this.addForm.unitattribute = ''; // 单位类别
                    this.addForm.unitresident = ''; // 单位驻地
                    this.addForm.DutyRoomTelephone = ''; // 值班室电话
                } else {
                    this.$message('请选择单位')
                }
            } else if (this.treedata.length == 0) {
                this.addForm.pid = 1;
                this.titletxet = '新增单位'
                this.dialogFormVisible = true;
                this.isAdd = true;
                this.addForm.addways = '';// 新增方式
                this.addForm.unitname = '';// 单位名称
                this.addForm.unitcode = '';// 单位代号
                this.addForm.superiorunit = ''; // 单位级别
                this.addForm.unitlevel = '';// 单位属性
                this.addForm.unitattribute = ''; // 单位类别
                this.addForm.unitresident = ''; // 单位驻地
                this.addForm.DutyRoomTelephone = ''; // 值班室电话
            }


        },

        // 编辑单位
        editunit() {
            this.titletxet = '编辑单位信息'
            if (this.addForm.xiajiid != '') {
                console.log(this.unitInfo)
                this.dialogFormVisible = true;
                this.isAdd = false;
                this.addForm.unitname = this.unitInfo.unitname;
                this.addForm.DutyRoomTelephone = this.unitInfo.DutyRoomTelephone;
                this.addForm.unitcode = this.unitInfo.unitcode;
                this.addForm.superiorunit = this.unitInfo.superiorunit;
                this.addForm.unitresident = this.unitInfo.unitresident;
                this.addForm.unitattribute = this.unitInfo.unitattribute;
                this.addForm.unitlevel = this.unitInfo.unitlevel;
            } else {
                this.$message('请选择单位')
            }


        },
        // 删除
        deletefn() {
            let _this = this;
            if (this.addForm.xiajiid == '') return this.$message('请选择要删除的单位');
            this.$confirm('是否继续删除这条单位记录？删除该单位将会删除相应的用户及表单信息！', '删除单位', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                this.$http.deleteunit(`/unit/deleteAboutUnit?unitId=${this.addForm.xiajiid}&userId=${this.userId}`).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.$message.success('删除成功')
                        this.getCompany(); // 查询单位
                        if (!this.addForm.shangjiid) {
                            this.addForm.xiajiid = '';
                        }
                        this.addForm.pid = '';
                        this.addForm.superiorubit = '';
                        this.unitInfo.companyunit = '';
                        this.unitInfo.unitattribute = '';
                        this.unitInfo.superiorunit = '';
                        this.unitInfo.unitname = '';
                        this.unitInfo.unitlevel = '';
                        this.unitInfo.DutyRoomTelephone = '';
                        this.unitInfo.unitcode = '';
                        this.unitInfo.unitresident = '';
                    } else {
                        this.$message(res.data || res.message);
                    }
                })
            }).catch(() => { });


        },

        UnitTypeIndexfn(i) {
            this.UnitTypeIndex = i;
        },

        // 查询单位类型
        unitCategoryDictsfn() {
            this.$http.unitCategoryDicts().then(res => {
                console.log(res)
                this.Unittype = res.data
            })
        },

        // 查询单位级别
        unitLevelDictsfn() {
            this.$http.unitLevelDicts().then(res => {
                console.log(res)
                this.Unitlevel = res.data;
                this.options = res.data;
            })
        },

        // 查询单位属性
        unitPropertyDictsfn() {
            this.$http.unitPropertyDicts().then(res => {
                console.log(res)
                this.Unitattribute = res.data;
            })
        },

        // 选择单位级别
        Unitlevelfn(data) {
            console.log(data)
            this.addForm.unitlevel = data.levelName;
            this.addForm.unitlevelId = data.id;
            document.getElementsByClassName('el-select-dropdown')[2].style.zIndex = 0;
            document.getElementsByClassName('el-select-dropdown')[3].style.zIndex = 0;
        },
        // 选择单位属性
        Unitattributefn(data) {
            console.log(data)
            this.addForm.superiorunit = data.propertyName;
            this.addForm.superiorunitId = data.id;
            document.getElementsByClassName('el-select-dropdown')[2].style.zIndex = 0;
            document.getElementsByClassName('el-select-dropdown')[3].style.zIndex = 0;
        },
        // 选择单位类型
        Unittypefn(data) {
            console.log(data)
            this.addForm.unitattribute = data.categoryName;
            this.addForm.unitattributeId = data.id;
            document.getElementsByClassName('el-select-dropdown')[2].style.zIndex = 0;
            document.getElementsByClassName('el-select-dropdown')[3].style.zIndex = 0;

        },

        // 新增方式
        addfangshi(e) {
            console.log(e)
            if (e == "同级(向下插入)") {
                this.addForm.unitId = this.addForm.shangjiid;
                console.log(this.addForm.unitId)
            } else if (e == "下级") {
                this.addForm.levels = '';
                this.addForm.unitId = this.addForm.xiajiid;
                console.log(this.addForm.unitId)
            }
        },

        // 过滤节点
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        treefn(value) {
            console.log(value)
            this.filterText = value;
        },
        treefn2(value) {
            console.log(value)
            this.filterText2 = value;
        },
        treefn3(value) {
            console.log(value)
            this.filterText3 = value;
        },
        visiblefn(b) {
            if (!b) {
                this.filterText = '';
                this.filterText2 = '';
                this.filterText3 = '';
            }
        }

    },
    mounted() {
        this.exporyUrl = document.location.origin;
        //   this.exporyUrl = 'http://192.168.0.70:8888';
        this.importurl = `${this.exporyUrl}/dev/unit/import`;
        if (this.roleId == 3) {
            this.$router.push({
                path: 'noauthority',
            })
        }
        this.getCompany(); // 查询单位
        this.unitCategoryDictsfn();
        this.unitLevelDictsfn();
        this.unitPropertyDictsfn();


    },
    watch: {
        filterText(val) {
            console.log(val)
            this.$refs.tree.filter(val);
        },
        filterText1(val) {
            console.log(val)
            this.$refs.tree1.filter(val);
        },
        filterText2(val) {
            console.log(val)
            this.$refs.tree2.filter(val);
        },
        filterText3(val) {
            console.log(val)
            this.$refs.tree3.filter(val);
        },

    }
}