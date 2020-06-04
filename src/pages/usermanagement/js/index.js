export default {
    name: 'usermanagement',
    data() {
        return {
            exporyUrl: '',
            importurl: '',
            paramsData: {
                roleId: 3,
                unitId: sessionStorage.getItem("unitId"),
            },
            paramsData2: {
                roleId: 2,
                unitId: sessionStorage.getItem("unitId"),
            },
            antirepeatclick: false,  // 防重复点击
            roleId: sessionStorage.getItem("roleId"),
            userId: sessionStorage.getItem("userID"),
            unitId: sessionStorage.getItem("unitId"),
            dialogFormVisible: false,
            dialogFormVisible2: false,
            isdisabled: false,
            isedit: true,
            formLabelWidth: '100px',
            addinfotitle: '',
            queryUserTreedata: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            tableData: [],
            count: 0, // 数据总数
            currentPage4: 1,
            pageIndex: 1,
            pageSize: 20,
            postuserList: {
                unitId: '',
            },
            // 新增数据
            adduserinfo: {
                addusertype: '', // 新增的类型
                account: '', // 账号名
                password: '', //密码
                fullname: '', // 姓名
                gender: 1, // 性别
                unitname: '', // 单位
                officialrank: '', // 职别
                militarytelephone: '', //军用电话
                officephone: '', // 办公电话
                userId: '',
                roleId: '',
            },
            subordinateUserId: '',
            editpas: {
                username: '',
                newPassword: '',
            },
            num: 0,
            loading: '',
            delUsers: [],
            delUserIds: [],
        }

    },
    methods: {
        // check2() { 
        //     if(this.adduserinfo.militarytelephone.length!=11)
        //     return this.$message('请输入11位手机号！')
        // },
        handleSelectionChange(item) {
            console.log(item)
            this.delUsers = item;
        },
        deluser() {
            if (this.delUsers.length == 0) return this.$message('请选择需要删除的用户');
            this.delUsers.forEach(item => {
                this.delUserIds.push(item.userId)
            });
            this.$confirm(`确认删除所选用户?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.batchDeleteUser({
                    userId: this.userId,
                    userIds: this.delUserIds.toString(),
                }).then(res => {
                    this.delUserIds = [];
                    console.log(res)
                    this.findUsersfn();
                    return res.code == 200 ? this.$message.success('删除成功') : this.$message(res.data || res.message);
                })
            }).catch(() => { });

        },
        // 导出
        exportTemplate() {
            window.open(`${this.exporyUrl}/dev/user/outputExcel`);
        },
        // 导入用户
        handleUploadForm(file) {
            console.log(file)
            this.num++;
            if (this.num == 1) {
                this.$confirm('您正在批量导入用户, 是否继续?', '导入用户', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.upload.submit();
                    this.loading = this.openLoading();
                }).catch(() => {
                    this.num = 0;
                });
            } else if (this.num == 2) {
                console.log(file.response);
                this.num = 0;
                this.findUsersfn();
                this.loading.close();
                return file.response.code == 200 ? this.$message.success('导入成功') : this.$message(file.response.data || file.response.message);
            }
        },
        // 导入填报员
        handleUploadForm2(file) {
            console.log(file)
            this.num++;
            if (this.num == 1) {
                this.$confirm('您正在批量导入填报员, 是否继续?', '导入填报员', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.upload2.submit();
                    this.loading = this.openLoading();
                }).catch(() => {
                    this.num = 0;
                });
            } else if (this.num == 2) {
                console.log(file.response);
                this.num = 0;
                this.findUsersfn();
                this.loading.close();
                return file.response.code == 200 ? this.$message.success('导入成功') : this.$message(file.response.data || file.response.message);
            }
        },
        // 验证账号不能为中文
        check() {
            //    if(this.adduserinfo.account){
            //        for(var i = 0; i < this.adduserinfo.account.length; i++){
            //            if(this.adduserinfo.account.charCodeAt(i) > 0 && this.adduserinfo.account.charCodeAt(i)<255){
            //            }else{
            //               this.adduserinfo.account = ''; 
            //            }
            //        } 
            //    }
            if (this.adduserinfo.militarytelephone) {
                for (var i = 0; i < this.adduserinfo.militarytelephone.length; i++) {
                    if (this.adduserinfo.militarytelephone.charCodeAt(i) > 0 && this.adduserinfo.militarytelephone.charCodeAt(i) < 255) {
                    } else {
                        this.adduserinfo.militarytelephone = '';
                    }
                }
            }
            if (this.adduserinfo.officephone) {
                for (var i = 0; i < this.adduserinfo.officephone.length; i++) {
                    if (this.adduserinfo.officephone.charCodeAt(i) > 0 && this.adduserinfo.officephone.charCodeAt(i) < 255) {
                    } else {
                        this.adduserinfo.officephone = '';
                    }
                }
            }
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#f2f2f2'
            } else {
                return ''
            }
        },
        // 点击单位事件
        handleNodeClick(data) {
            console.log(data);
            this.postuserList.unitId = data.id;
            console.log(this.postuserList.unitId)
            console.log(this.unitId)
            this.adduserinfo.unitname = data.name;
            this.findUsersfn();
        },
        handleSizeChange(size) {
            console.log(size);
            this.pageSize = size;
            this.findUsersfn();
        },
        handleCurrentChange(index) {
            console.log(index);
            this.pageIndex = index;
            this.findUsersfn();
        },

        // 查询单位架构
        queryUserTreefn() {
            this.$http.queryUserTree(`/unit/queryUserTree?unitId=${this.unitId}`).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.queryUserTreedata = res.data;
                }
            })
        },

        // 单位下用户查询
        findUsersfn() {
            this.$http.findUsers(`/user/findUsers?unitId=${this.postuserList.unitId}&page=${this.pageIndex}&limit=${this.pageSize}`).then(res => {
                console.log(res)
                if (res.code == 0 && res.data) {
                    this.count = res.count;
                    res.data.forEach(e => {
                        if (e.gender == 2) {
                            e.gender = '女'
                        } else if (e.gender == 1) {
                            e.gender = '男'
                        };
                        if (e.roleId == 1) {
                            e.roleId = '管理员'
                        } else if (e.roleId == 2) {
                            e.roleId = '填报员'
                        } else if (e.roleId == 3) {
                            e.roleId = '用户'
                        };
                    });
                    this.tableData = res.data;
                } else if (!res.data) {
                    this.tableData = res.data;
                }
            })
        },

        // 新增管理员 /填报员 /用户
        addregistryfn(e) {
            if (this.adduserinfo.unitname == '') return this.$message('请选择所属单位')
            this.isdisabled = false;
            this.adduserinfo.addusertype = e;
            this.dialogFormVisible = true;
            this.isedit = true;
            this.adduserinfo.account = '';
            this.adduserinfo.fullname = '';
            this.adduserinfo.officialrank = '';
            this.adduserinfo.militarytelephone = '';
            this.adduserinfo.officephone = '';
            this.adduserinfo.password = '';
            this.adduserinfo.gender = '';
            this.adduserinfo.roleId = '';
            if (e == 1) {
                this.addinfotitle = '新增管理员'
            } else if (e == 2) {
                this.addinfotitle = '新增填报员'
            } else if (e == 3) {
                this.addinfotitle = '新增用户'
            }
        },

        // 新增提交
        addsubmit(type) {
            if (type) {
                //    if(this.adduserinfo.account.indexOf(",") != -1 || this.adduserinfo.account.indexOf(":") != -1 || this.adduserinfo.password.indexOf(",") != -1 || this.adduserinfo.password.indexOf(":") != -1 || 
                //    this.adduserinfo.fullname.indexOf(",") != -1 || this.adduserinfo.fullname.indexOf(":") != -1 || this.adduserinfo.officialrank.indexOf(",") != -1 || this.adduserinfo.officialrank.indexOf(":") != -1 )
                //    return this.$message('不能出现英文状态下的“,”“:”');
                // if(this.adduserinfo.militarytelephone.length!=11) return this.$message('填写11位手机号')
                if (this.adduserinfo.account == '') return this.$message('请填写账号');
                if (this.adduserinfo.password == '') return this.$message('请填写密码');
                if (this.adduserinfo.password.length < 6 || this.adduserinfo.password.length > 20) return this.$message('密码长度为6-20位');
                if (this.adduserinfo.fullname == '') return this.$message('请填写姓名');
                if (this.adduserinfo.gender == '') return this.$message('请选择性别');
                if (this.adduserinfo.officialrank == '') return this.$message('请填写职别');

                this.dialogFormVisible = false;
                this.antirepeatclick = true;
                this.$http.addregistry({
                    operationUserId: this.userId,
                    roleId: this.adduserinfo.addusertype,
                    account: this.adduserinfo.account,
                    userName: this.adduserinfo.fullname,
                    unitId: this.postuserList.unitId,
                    gender: this.adduserinfo.gender,
                    passWord: this.adduserinfo.password,
                    positions: this.adduserinfo.officialrank,
                    armyPhone: this.adduserinfo.militarytelephone,
                    officePhone: this.adduserinfo.officephone,
                }).then(res => {
                    console.log(res)
                    this.antirepeatclick = false;
                    if (res.code == 201) {
                        this.findUsersfn();
                        this.$message.success('新增成功')
                    } else {
                        this.$message(res.data || res.message);
                    }
                })
            } else {
                // if(this.adduserinfo.account.indexOf(",") == -1 || this.adduserinfo.account.indexOf(":") == -1 || this.adduserinfo.password.indexOf(",") == -1 || this.adduserinfo.password.indexOf(":") == -1 || 
                // this.adduserinfo.fullname.indexOf(",") == -1 || this.adduserinfo.fullname.indexOf(":") == -1 || this.adduserinfo.officialrank.indexOf(",") == -1 || this.adduserinfo.officialrank.indexOf(":") == -1 )
                // return this.$message('不能出现英文状态下的“,”“:”');
                if (this.adduserinfo.account == '') return this.$message('请填写账号');
                if (this.adduserinfo.fullname == '') return this.$message('请填写姓名');
                if (this.adduserinfo.officialrank == '') return this.$message('请填写职别');
                this.antirepeatclick = true;
                this.dialogFormVisible = false;
                this.$http.editUser({
                    operationUserId: this.userId,
                    account: this.adduserinfo.account,
                    armyPhone: this.adduserinfo.militarytelephone,
                    officePhone: this.adduserinfo.officephone,
                    userName: this.adduserinfo.fullname,
                    positions: this.adduserinfo.officialrank,
                    userId: this.adduserinfo.userId,
                    unitId: this.postuserList.unitId,
                    roleId: this.adduserinfo.roleId,
                    gender: this.adduserinfo.gender
                }).then(res => {
                    console.log(res)
                    this.antirepeatclick = false;
                    if (res.code == 201) {
                        this.$message.success('修改成功')
                        this.findUsersfn();
                    } else {
                        this.$message(res.data || res.message);
                    }
                })
            }
        },
        // 修改密码
        pwssubmit() {
            if (this.editpas.newPassword != '' && this.editpas.newPassword.length >= 6) {
                this.$http.changeSubordinateUserPassword({
                    userId: this.userId,
                    subordinateUserId: this.adduserinfo.userId,
                    password: this.editpas.newPassword,
                }).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.dialogFormVisible2 = false;
                        this.$message.success(res.message);
                    } else {
                        this.$message('重置失败')
                    }
                })
                this.editpas.newPassword = '';
            } else {
                this.$message('密码不能为空,并且不能小于6位数')
            }

        },

        // 查看
        vieworedit(data, i) {
            console.log(data)
            this.adduserinfo.userId = data.userId;
            console.log(i)
            if (i == 1) {
                this.isdisabled = true;
                this.isedit = true;
                this.addinfotitle = '查看详情';
            } else if (i == 2) {
                this.isdisabled = false;
                this.isedit = false;
                this.addinfotitle = '编辑信息';
            } else if (i == 3) {
                if (this.adduserinfo.userId == this.userId) return this.$message('请联系上级管理员删除');
                this.$confirm('是否删除此账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.deleteUser({
                        userId: this.adduserinfo.userId,
                        ownUserId: this.userId,
                    }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                            this.$message.success(res.message)
                        } else {
                            this.$message(res.message)
                        }

                        this.findUsersfn();
                    })
                }).catch(() => { });

            } else if (i == 4) {
                if (this.adduserinfo.userId == this.userId) {
                    this.$message('请联系上级管理员为您重置，或验证原密码进行修改');
                } else {
                    this.editpas.username = data.account;
                    this.dialogFormVisible2 = true;
                }

            }
            if (i == 1 || i == 2) {
                this.$http.userDetail(this.adduserinfo.userId).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.dialogFormVisible = true;
                        this.adduserinfo.account = res.data.account;
                        this.adduserinfo.fullname = res.data.userName;
                        this.postuserList.unitId = res.data.unitId;
                        this.adduserinfo.unitname = res.data.unitName;
                        this.adduserinfo.officialrank = res.data.positions;
                        this.adduserinfo.militarytelephone = res.data.armyPhone;
                        this.adduserinfo.officephone = res.data.officePhone;
                        this.adduserinfo.password = res.data.password;
                        this.adduserinfo.gender = res.data.gender
                        this.adduserinfo.roleId = res.data.roleId;
                    }
                })
            }


        }
    },
    mounted() {
        this.exporyUrl = document.location.origin;
        // this.exporyUrl = 'http://192.168.1.70:8888';
        this.importurl = this.exporyUrl + '/dev/user/batchRegistry';
        if (this.roleId == 3) {
            this.$router.push({
                path: 'noauthority',
            })
        }
        this.queryUserTreefn(); // 查询单位架构
    }
}