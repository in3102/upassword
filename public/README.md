#### 开源地址 
https://github.com/in3102/upassword

#### 数据安全

1. 开门密码以 BCrypt 加密存储
2. 帐号信息均加密后存储 (`aes-256-cbc`，*加密秘钥为管理密码经过哈希处理的值*)

#### 数据存储

数据存储在本地电脑 uTools 内置的版本数据库，如果 *uTools 帐号与数据* 开启了云端备份&多端同步，则数据会备份一份到云端

#### 忘记密码

忘记密码无法找回，只能格式化插件数据

进入 *uTools 帐号与数据* -> 点击 *密码管理器* 文档 -> 格式化

#### 使用技巧

1. 帐号可拖动排序、可拖动到左侧分组直接变更分组
2. 分组可拖动变更层级关系
3. 快捷键 `Command/Ctrl + U` 复制当前帐号用户名
4. 快捷键 `Command/Ctrl + P` 复制当前帐号密码
4. 快捷键 `Command/Ctrl + N` 新增帐号