
import { get, post, put, deletefn} from './ajax'
import { qspost2} from './ajax2'

/**
 *
                            _ooOoo_
                           o8888888o
                           88" . "88
                           (| -_- |)
                           O\  =  /O
                        ____/`---'\____
                      .'  \\|     |//  `.
                     /  \\|||  :  |||//  \
                    /  _||||| -:- |||||-  \
                    |   | \\\  -  /// |   |
                    | \_|  ''\---/''  |   |
                    \  .-\__  `-`  ___/-. /
                  ___`. .'  /--.--\  `. . __
               ."" '<  `.___\_<|>_/___.'  >'"".
              | | :  `- \`.;`\ _ /`;.`/ - ` : | |
              \  \ `-.   \_ __\ /__ _/   .-` /  /
         ======`-.____`-.___\_____/___.-`____.-'======
                            `=---='
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                     佛祖保佑       永无BUG
 */

/**
 * 统一管理api接口
 * @param {string} params
 */


// //  测试
// const test = params => post('/EtEnterprisePolicy/addEtEnterprisePolicyInfo', params)







// 登录/登出
const login = params => post('/user/login', params)
const logout = params => post('/user/logout', params)

// 首页统计查询接口
const formAndTaskStatistics = params => get(`/home/formAndTaskStatistics?` + params)

// 修改密码PUT
const editPassword = params => put('/user/editPassword', params)
/** ======================================单位相关接口======================================= */

// 查询单位类型
const unitCategoryDicts = params => get('/unitCategoryDicts/getUnitCategoryDicts', params)

// 新增单位类型
const unitCategoryDictsadd = params => qspost2('/unitCategoryDicts/add', params)

// 删除单位类型
const unitCategoryDictsdelete = params => qspost2('/unitCategoryDicts/delete', params)

// 编辑单位类型
const unitCategoryDictsupdate = params => qspost2('/unitCategoryDicts/update', params)

// 查询单位属性
const unitPropertyDicts = params => get('/unitPropertyDicts/getUnitPropertyDicts', params)

// 新增单位属性
const unitPropertyDictsadd = params => qspost2('/unitPropertyDicts/add', params)

// 删除单位属性
const unitPropertyDictsdelete = params => qspost2('/unitPropertyDicts/delete', params)

// 编辑单位属性
const unitPropertyDictsupdate = params => qspost2('/unitPropertyDicts/update', params)

// 查询单位等级
const unitLevelDicts = params => get('/unitLevelDicts/getUnitLevelDicts', params)

// 新增单位等级
const unitLevelDictsadd = params => qspost2('/unitLevelDicts/add', params)

// 删除单位等级
const unitLevelDictsdelete = params => qspost2('/unitLevelDicts/delete', params)

// 编辑单位等级
const unitLevelDictsupdate = params => qspost2('/unitLevelDicts/update', params)

/** ========================================end============================================= */

/** =====================================表单管理模块接口=================================== */

// 新增单位
const addData = params => post('/unit/addData', params)

// 查询单位
const queryTree = params => get('/unit/queryTree', params)

// 单位详细信息
const unitInfo = params => get(params)

// 单位详细信息
const editunitpost = params => put('/unit/update', params)

// 删除单位
const deleteunit = params => deletefn(params)

// 查询表单列表
const querryformList = params => get(params)

// 删除表单
const deleteformdata = params => qspost2('/form/deleteForm', params)

// 点击编辑时查询表单数据
const editgetAtr = params => get(params)

// 编辑表单字段数据
const editformdata = params => qspost2('/form/upfield', params)

// 删除表单字段数据
const deleteFiledById = params => qspost2('/form/deleteFiledById', params)

// 查询表单类型
const queryFormAttribute = params => get('/form/queryFormAttribute', params)

// 获取表单属性
const getFormAtrribute = params => get('/newForm_/getFormAtrribute', params)

// 查询下发单位列表
const queryTree3 = params => get(params)

// 表单下发
const issuedForm = params => qspost2('/form/issuedForm', params)

// 查询分发人员列表
const getReportersByUnitId = params => get(params)

// 表单分发
const distributeForm = params => qspost2('/form/distributeForm', params)

// 分发查看
const formDistributeTask = params => get(params)

// 下发查看
const formTask = params => get('/form/formTask?' + params)

// 1.查看
const getFormData = params => get(params)

// 1.获取表头
const gettableheader = params => get(`/newForm_/getAtr?` + params)

// 2.获取数据
const queryFormOfficialData = params => get(params)

// 增加表单数据(填报)
const addFormData = params => qspost2('/form/addFormData', params)

// 填报员 数据上报
const tbydataUpload = params => qspost2('/form/dataUpload', params)

// 上报数据审核
const adataExamine = params => qspost2('/form/dataExamine', params)

// 数据驳回
const dataReject = params => qspost2('/form/dataReject', params)

// 数据导出
const dataoutputExcel = params => get(params)

// 填报员删除
const tbydeleteFormData = params => qspost2('/form/deleteFormData', params)

// 填报员编辑
const tbyeditFormData = params => qspost2('/form/editFormData', params)

/* =====================================end=================================== */

/* ===================================== 日志管理模块接口============================== */
// 获取用户日志
const getLog = params => get('/sysLog/getLog?' + params)

// 获取用户推送日志
const getRemind = params => get('/sysLog/getRemind?' + params)

// 新增表单
const addFormTable = params => post('/form/addFormTable', params)

// 统计用户未读日志
const unread = params => get(params)

// 设置推送为已读
const setRead = params => qspost2('/sysLog/setRead', params)

// 获取下级管理员
const acquireSubordinateManagers = params => get(params)

// 推送日志
const addRemind = params => qspost2('/sysLog/addRemind', params)

/* =====================================end============================== */

/* ===================================== 用户管理模块接口============================== */

// 用户管理单位架构
const queryUserTree = params => get(params)

// 查询该单位下的用户
const findUsers = params => get(params)

// 新增接口 ---管理员 用户 填报员
const addregistry = params => post('/user/registry', params)

// 查看详情
const userDetail = params => get('/user/userDetail/' + params)

// 编辑用户信息
const editUser = params => put('/user/editUser', params)

// 删除用户
const deleteUser = params => qspost2(`/user/deleteUser`, params)

/* =====================================end============================== */

/* ===================================== 单位字典============================== */

// 查询单位级别字典详情接口
const unitLevelDicts1 = params => get(params)

// 查询单位属性字典详情接口
const unitLevelDicts2 = params => get(params)

// 查询单位类型字典详情接口
const unitLevelDicts3 = params => get(params)

/* =====================================单位字典end============================== */

/* ===================================== 任务生成接口 ============================== */

// 查询属性
const getTaskAtr = params => get('/task/getTaskAtr', params)

// 查询单位名称
const getUnitByProperty = params => get(params)

// 表单名称查询
const fromquerryname = params => get(`/form/querryById?` + params)

// 表单字段
const queerformfield = params => get(`/form/getAtr?` + params)

// 新增任务接口
const addTaskTable = params => qspost2('/task/addTaskTable', params)

// 查询任务列表
const queryTaskList = params => get(`/task/queryTaskList?` + params)

// 删除任务列表
const deleteTask = params => qspost2('/task/deleteTask', params)

// 任务下发
const issueTask = params => qspost2('/task/issueTask', params)

// 分发任务
const taskdistributeTask = params => qspost2('/task/distributeTask', params)

// 任务推送
const taskpushTask = params => qspost2('/task/pushTask', params)

// 查询该单位下roeld == 3 的用户
const getUsersByUnitId = params => get(`/user/getUsersByUnitId?` + params)

// 任务下发查看接口
const queryissueTask = params => get(`/task/queryissueTask?` + params)

// 任务分发查看接口
const queryDistributeTaskai = params => get(`/task/queryDistributeTaskai?` + params)

// 任务推送查看接口
const queryPushTask = params => get(`/task/queryPushTask?` + params)

// 查看获取表头接口
const getTaskProperty = params => get(`/task/getTaskProperty?` + params)

// 获取数据
const getDataList = params => get(`/task/getDataList?` , params)
const task_getUsersData = params => get(`/task/getUsersData` , params)

// 任务填报 新增/编辑
const updateTaskData = params => qspost2('/task/updateTaskData', params)

// 删除填报数据
const deleteTaskData = params => qspost2('/task/deleteTaskData', params)

// 任务数据上报
const taskDataReport = params => qspost2('/task/taskDataReport', params)

// 任务数据 审核 驳回接口
const taskDataExamine = params => qspost2('/task/taskDataExamine', params)

// 任务属性编辑
const editTaskAttribute = params => qspost2('/task/editTaskAttribute', params)

// 任务属性删除
const deleteTaskAttribute = params => qspost2('/task/deleteTaskAttribute', params)

// 新增任务属性
const addTaskAttribute = params => qspost2('/task/addTaskAttribute', params)

// 新增表单属性
const addformAttribute = params => qspost2('/newForm_/addformAttribute', params)

// 编辑表单属性
const editformAttribute = params => qspost2('/newForm_/editformAttribute', params)

// 删除表单属性
const deleteformAttribute = params => qspost2('/form/deleteformAttribute', params)

// 填报员导入
const updateFile = params => qspost2('/form/inputExcel', params)

// 表单排序
const updateFormDataSerialNumber = params => qspost2('/form/updateFormDataSerialNumber', params)

// 任务排序
const updateTaskDataSerialNumber = params => qspost2('/task/updateTaskDataSerialNumber', params)

/** =============================消息提醒接口=============================== */

// 统计未读数
const countUnread = params => get(`/FormNews/countUnread?` + params)

// 获取消息
const allFormNews = params => get(`/FormNews/allFormNews?` + params)

// 批量修改状态
const getFormNews = params => get(`/FormNews/getFormNews?` + params)

// 表单推送
const formPush = params => qspost2('/form/formPush', params)

// 表单推送查看
const formPushTask = params => get(`/form/formPushTask?` + params)

/* ===================================查询统计接口================================= */

// 查询统计列表
const qryQueryStatisticsList = params => qspost2('/queryStatistics/qryQueryStatisticsList', params)

// 查询统计详情
const qryQueryStatisticsDataList = params => qspost2('/queryStatistics/qryQueryStatisticsDataList', params)

// 收藏常用电话本
const batchAddPhoneBook = params => qspost2('/queryStatistics/batchAddPhoneBook', params)

// 常用电话本列表
const qryPhoneBookList = params => qspost2('/queryStatistics/qryPhoneBookList', params)

// 电话本详情
const qryPhoneBookDataList = params => qspost2('/queryStatistics/qryPhoneBookDataList', params)

// 查询表单单位树
const sendFormUnits = params => get(`/form/sendFormUnits?` + params)// .....
const getDataUnit = params => get(`/newForm_/getDataUnit?` + params)

// 任务生成类型接口
const getAttribute = params => qspost2('queryStatistics/getAttribute', params)

// 取消收藏常用电话本
const batchDeletePhoneBook = params => qspost2('/queryStatistics/batchDeletePhoneBook', params)

// user根据表单属性查询
const getFormObj = params => get(`/newForm_/getFormObj?` + params)

const getTaskTab = params => get(`/task/getTaskTab?` + params)

// 表单 下发 分发 撤销
const formPublishRevoke = params => qspost2('/form/formPublishRevoke', params)

// 任务 下发 分发 撤销
const taskPublishRevoke = params => qspost2('/task/taskPublishRevoke', params)

const formPushLook = params => get(`/form/formPushLook?` + params)

// 删除消息
const deleteFormNews = params => qspost2('/FormNews/deleteFormNews', params)
// 管理员修改密码
const changeSubordinateUserPassword = params => qspost2('/user/changeSubordinateUserPassword', params)

// 任务数据驳回
const taskDataReject = params => qspost2('/task/taskDataReject', params)

// 任务已下发查看
const taskAlreadyIssued = params => get(`/task/taskAlreadyIssued?` + params)

// 任务推送撤销接口
const taskPushRemove = params => qspost2('/task/taskPushRemove', params)

// 表单推送撤销
const formPushRemove = params => qspost2('/form/formPushRemove', params)

// 获取任务单位 左侧
const sendTaskUnits = params => get(`/task/sendTaskUnits?` + params)
const task_getDataUnit = params => get(`/task/getDataUnit?` + params)

// 获取推送用户 单位
const getPushUser = params => get(`/user/getPushUser?` + params)

/* 新表单接口 */
// 查看表单数据
const newQueryFormData = params => get('/newForm_/queryFormData?' + params)// .....
const newGetUserData = params => get('/newForm_/getUsersData?' + params)
const getFormUpdateData = params => get('/newForm_/getFormUpdateData?' + params)
const reportFormUpdateData = params => qspost2('/newForm_/reportFormUpdateData' , params)
const rejectFormUpdateData = params => qspost2('/newForm_/rejectFormUpdateData' , params)
const examineFormUpdateData = params => qspost2('/newForm_/examineFormUpdateData' , params)
const deleteFormUpdate = params => qspost2('/newForm_/deleteUpdateData' , params)
const getTaskUpdateData = params => get('/task/getTaskUpdateData?' + params)
const reportTaskUpdateData = params => qspost2('/task/reportTaskUpdateData' , params)
const deleteTaskUpdate = params => qspost2('/task/deleteUpdateData' , params)
const rejectTaskUpdateData = params => qspost2('/task/rejectTaskUpdateData' , params)
const examineTaskUpdateData = params => qspost2('/task/examineTaskUpdateData' , params)
const copyTask = params => qspost2('/task/saveOtherTask', params)

// 查询表单数据
const newGetFormTabShow = params => get('/newForm_/getFormTabShow?' + params)

// 填报
const newAddFormData = params => qspost2('/newForm_/addFormData', params)

// 添加表单
const newAddForm = params => post('/newForm_/addForm', params)

// 复制表单
const copyAddForm = params => qspost2('/newForm_/saveOtherForm', params)

// 表单下发 分发
const newFormPublish = params => qspost2('/newForm_/formPublish', params)

// 表单数据编辑
const newUpdateData = params => qspost2('/newForm_/updateData', params)

// 删除表单数据
const newDeleteData = params => qspost2('/newForm_/deleteData', params)

// 表单推送
const newPushForm = params => qspost2('/newForm_/pushForm', params)

// 表单已下发查看
const newFormPublishLook = params => get('/newForm_/formPublishLook?' + params)

// 表单已推送查看
const newFormPushLook = params => get('/newForm_/formPushLook?' + params)

// 表单推送撤销
const newFormPushRemove = params => qspost2('/newForm_/formPushRemove', params)

// 表单数据驳回
const newDataReject = params => qspost2('/newForm_/dataReject', params)

// 表单数据上报
const newDataReport = params => qspost2('/newForm_/dataReport', params)

// 表单数据审核
const newDataExamine = params => qspost2('/newForm_/dataExamine', params)

// 表单下发撤销
const newFormPublishRevoke = params => qspost2('/newForm_/formPublishRevoke', params)

// 表单删除
const newDeleteForm = params => qspost2('/newForm_/deleteForm', params)

// 编辑表单字段
const newUpfield = params => qspost2('/newForm_/upfield', params)

// 删除表单字段
const newDeleteFiledById = params => qspost2('/newForm_/deleteFiledById', params)

// 添加表单字段
const newAddfield = params => qspost2('/newForm_/addfield', params)

// 表单排序
const newDataSizeNumRestar = params => qspost2('/newForm_/dataSizeNumRestar', params)

// 任务核对
const checkData = params => qspost2('/task/checkData', params)

// 删除任务属性
const deleteAttribute = params => qspost2('/task/deleteAttribute', params)

// 删除表单属性
const deleteFormAttribute = params => qspost2('newForm_/deleteFormAttribute', params)

// 日志管理 获取单位
const getLogUnit = params => get(`/sysLog/getLogUnit?` + params)

// 获取日志
const getLogNew = params => get(`/sysLog/getLogNew?` + params)

// 手动提醒
const updateFormNews = params => qspost2('newForm_/updateFormNews', params)

// 批量删除用户
const batchDeleteUser = params => qspost2('user/batchDeleteUser', params)

// 获取cpu使用率
const getCpuUsage = params => get(`/cpuUsage/getCpuUsage?` + params)

// 获取磁盘使用率
const getHdIOpPercent = params => get(`/cpuUsage/getHdIOpPercent?` + params)

// 获取内存使用率
const getMemoryUsage = params => get(`/cpuUsage/getMemoryUsage?` + params)

// 带宽使用率
const getNetWork = params => get(`/cpuUsage/getNetWork?` + params)

// 网络速度
const getNetWorkSpeed = params => get(`/cpuUsage/getNetWorkSpeed?` + params)

// 任务下发 分发合并接口
const newTaskpublish = params => qspost2('task/newTaskpublish', params)

export default {
  newTaskpublish,
  getNetWork,
  getNetWorkSpeed,
  getMemoryUsage,
  getHdIOpPercent,
  getCpuUsage,
  batchDeleteUser,
  updateFormNews,
  getLogUnit,
  getLogNew,
  newQueryFormData, // ......
  copyTask,
  getTaskUpdateData,
  reportTaskUpdateData,
  deleteTaskUpdate,
  deleteFormUpdate,
  rejectTaskUpdateData,
  examineTaskUpdateData,
  getFormUpdateData,
  reportFormUpdateData,
  rejectFormUpdateData,
  examineFormUpdateData,
  newGetUserData,
  newAddFormData,
  newGetFormTabShow,
  newAddForm,
  copyAddForm,
  newFormPublish,
  newUpdateData,
  newDeleteData,
  newFormPublishLook,
  newPushForm,
  newFormPushLook,
  newFormPushRemove,
  newDataReject,
  newDataReport,
  newDataExamine,
  newFormPublishRevoke,
  newDeleteForm,
  newUpfield,
  newDeleteFiledById,
  newAddfield,
  newDataSizeNumRestar,
  checkData,
  getFormAtrribute,
  deleteAttribute,
  deleteFormAttribute,
  login,
  logout,
  formAndTaskStatistics,
  editPassword,
  changeSubordinateUserPassword,
  unitCategoryDicts,
  unitCategoryDictsadd,
  unitCategoryDictsdelete,
  unitCategoryDictsupdate,
  unitPropertyDicts,
  unitPropertyDictsadd,
  unitPropertyDictsdelete,
  unitPropertyDictsupdate,
  unitLevelDicts,
  unitLevelDictsadd,
  unitLevelDictsdelete,
  unitLevelDictsupdate,
  addData,
  queryTree,
  unitInfo,
  editunitpost,
  deleteunit,
  querryformList,
  deleteformdata,
  editgetAtr,
  editformdata,
  deleteFiledById,
  queryFormAttribute,
  queryTree3,
  issuedForm,
  getReportersByUnitId,
  distributeForm,
  formDistributeTask,
  formTask,
  getFormData,
  gettableheader,
  queryFormOfficialData,
  addFormData,
  tbydataUpload,
  adataExamine,
  dataReject,
  dataoutputExcel,
  tbydeleteFormData,
  tbyeditFormData,
  getLog,
  getRemind,
  addFormTable,
  unread,
  setRead,
  acquireSubordinateManagers,
  addRemind,
  queryUserTree,
  findUsers,
  addregistry,
  userDetail,
  editUser,
  deleteUser,
  unitLevelDicts1,
  unitLevelDicts2,
  unitLevelDicts3,
  getTaskAtr,
  getUnitByProperty,
  fromquerryname,
  queerformfield,
  addTaskTable,
  queryTaskList,
  deleteTask,
  issueTask,
  taskdistributeTask,
  taskpushTask,
  getUsersByUnitId,
  queryissueTask,
  queryDistributeTaskai,
  queryPushTask,
  getTaskProperty,
  getDataList,
  updateTaskData,
  deleteTaskData,
  taskDataReport,
  taskDataExamine,
  editTaskAttribute,
  deleteTaskAttribute,
  addTaskAttribute,
  addformAttribute,
  editformAttribute,
  deleteformAttribute,
  updateFile,
  updateFormDataSerialNumber,
  updateTaskDataSerialNumber,
  countUnread,
  allFormNews,
  getFormNews,
  formPush,
  formPushTask,
  qryQueryStatisticsList,
  qryQueryStatisticsDataList,
  batchAddPhoneBook,
  qryPhoneBookList,
  qryPhoneBookDataList,
  sendFormUnits, // ....
  getDataUnit,
  task_getDataUnit,//任务
  getAttribute,
  batchDeletePhoneBook,
  getFormObj,
  getTaskTab,
  formPublishRevoke,
  taskPublishRevoke,
  formPushLook,
  deleteFormNews,
  taskDataReject,
  taskAlreadyIssued,
  taskPushRemove,
  formPushRemove,
  sendTaskUnits,
  getPushUser,
  task_getUsersData,
  // test, // 测试
}
