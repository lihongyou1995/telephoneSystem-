<template>
    <div class="editUpdateData">
            <el-table
                :data="tableData"
                style="width: 100%"
                max-height="250">
                <el-table-column
                    class-name="test-class"
                    v-for="(item,index) in tableheader"
                    :key="index"
                    :label="item.propertyName.length>8?item.propertyName.slice(0,8)+'...' :item.propertyName"
                    align="center"
                    :prop="item.propertyName"
                    data-id="序号"
                    :width="item.width"
                ></el-table-column>
            </el-table>
    </div>

</template>