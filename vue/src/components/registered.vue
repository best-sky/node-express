<template>
	<div class="login_warp" ref="warp">
		<div class="login">
			<h2>用户注册</h2>
			<div class="main">
				<p>设置账号:</p>
				<el-input v-model.trim="userName" placeholder="请输入账号(手机号)" prefix-icon="fa fa-user-o " type="text" clearable></el-input>
				<p>设置密码:</p>
				<el-input v-model.trim="loginPass" placeholder="请设置密码" prefix-icon="fa fa-unlock " type="password" clearable></el-input>
				<p>确认密码:</p>
				<el-input v-model.trim="confirmPass" placeholder="请确认密码" prefix-icon="fa fa-unlock " type="password" clearable></el-input>
				<p>绑定邮箱:</p>
				<el-input v-model.trim="email" placeholder="请确认你的邮箱地址" prefix-icon="fa fa-telegram " type="email" clearable></el-input>
				<el-button type="primary" @click="registered">立即注册</el-button>
			</div>
			<div class="footer">
				<span @click="$router.push('login')">返回登录页</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				userName: "",
				loginPass: '',
				confirmPass: '',
				email: ""
			}
		},
		mounted: function() {
			this.$setHeight();
		},
		methods: {
			registered() {
				let data = {
					userName: this.userName,
					loginPass: this.loginPass,
					confirmPass: this.confirmPass,
					email: this.email
				};
				this.$getData("/users/registered", data, "post", res => {
					//console.log(res);
					if(res.data.code == 1) {
						this.$message({
							message: "注册成功，请前往登录",
							type: 'success'
						});
						setTimeout(() => {
							this.$router.push("login")
						}, 3000);
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				});
			}
		}
	}
</script>

<style>
	.login_warp {
		display: flex;
		justify-content: center;
	}
	
	.login {
		width: 400px;
		height: 570px;
		background-color: rgba(255, 255, 255, 0.4);
		margin-top: 150px;
		text-align: center;
		padding-top: 20px;
		border-radius: 10px;
	}
	
	.login h2 {
		margin: 0;
		font-weight: 100;
	}
	
	.login .main {
		width: 70%;
		margin: 0 auto;
		text-align: left;
	}
	
	.login .main p:nth-of-type(1) {
		margin-top: 40px;
	}
	
	.login .footer {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		color: grey;
		margin-top: 1rem;
	}
	
	.el-button {
		width: 100%;
		margin-top: 40px;
	}
</style>