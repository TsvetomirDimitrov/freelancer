//ako ima user

// var socket = io.connect('http://localhost:3000')
// setTimeout(()=> {
// 	console.log('xelo')
// }, )



				// const conversationId = fetch('/conversations/<%=currentUser.id%>').then(result => result.json())
				// // .then(json => console.log(json[0]._id))

				// let chatMember = ''
				// let nickname = ''
				// let currentChatId = ''
				// let arr = [];
				// let userId = ''
				// const conversations = fetch('/conversations/<%=currentUser.id%>').then(result => result.json()).then(json => {

				// 	Array.from(document.getElementsByClassName("users")).forEach(el => {
				// 		el.innerHTML = json.map(chat => {
				// 			// console.log(chat)
				// 			for (let i = 0; i < 2; i++) {
				// 				if (chat.members[i] != '<%=currentUser.id%>') {

				// 					chatMember = chat.members[i]
				// 					fetch(`/conversations/getUser/${chatMember}`).then(result => result.json()).then(res => {
				// 						userId = res._id;
				// 						nickname = res.nickname
				// 						console.log(nickname)
				// 						// console.log(res)
				// 						Array.from(document.getElementsByClassName("users")).forEach(el => {
				// 							el.innerHTML = json.map(use => {

				// 								return `<button id="chatUser" value="${nickname}">${nickname}</button>`
				// 							})
				// 						})
				// 					})


				// 				}
				// 			}

				// 		})

				// 	})
				// })



				// $(function () {
				// 	$('#chatUser').on('click', function (e) {

				// 		console.log('asd')




				// 	});
				// });

				// $(document).on('click', '#chatUser', function () {



				// })

				// $(document).on('click', '#chatUser', function (e) {

				// 	const value = $(this).attr('value');
				// 	// console.log(value)
				// 	// let id = fetch('/conversations/getUser/'+value).then(result => result.json()).then(json => {
				// 	// 	console.log(json)
				// 	// })
				// 	const conversationId = fetch('/conversations/<%=currentUser.id%>').then(result => result.json())
				// 	.then(json => console.log(json))

				// 	fetch('/messages/' + conversationId).then(result => result.json()).then(json => {
				// 		Array.from(document.getElementsByClassName("messages")).forEach(el => {
				// 			el.innerHTML = json.map(chat => {

				// 				console.log(chat)
				// 				if (chat.from == value) {

				// 					return `<p style="color: black;">${chat.from} - ${chat.text}</p>
				// 					`
				// 				} else if (chat.from == '<%=currentUser.nickname%>') {
				// 					return `<p style="color: red;">${chat.from} - ${chat.text} ${moment(chat.createdAt).fromNow()}</p>`
				// 					console.log('<%=currentUser.id%>')

				// 				}

				// 			}).join('')
				// 		})
				// 	})
				// })

				// $(document).on("click", "#send", function (e) {
				// 	e.preventDefault();
				// 	const message = {
				// 		senderId: '<%=currentUser.id%>',
				// 		text: $('#text').val(),
				// 		connversationId
				// 	}
				// })

				
				// Array.from(document.getElementsByClassName("users")).forEach(el => {
						// 	el.innerHTML = ids.map(res => {
						// 		return `<button id= "chatUser"style="color:black";>${nickname}</button>`
						// 	}).join('')
						// })

					// console.log(conversationsArray)
					// conversationsArray.forEach(el=> {
					// 	console.log(el)
					// })


// Array.from(document.getElementsByClassName("messages")).forEach(el => {
				// // 			el.innerHTML = json.map(chat => {

				// // 				console.log(chat)
				// // 				if (chat.from == value) {

				// // 					return `<p style="color: black;">${chat.from} - ${chat.text}</p>
