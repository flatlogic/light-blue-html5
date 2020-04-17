const p1 = '../img/chat/avatars/1.png';
const p2 = '../img/chat/avatars/2.png';
const p3 = '../img/chat/avatars/3.png';
const p4 = '../img/chat/avatars/5.png';
const p5 = '../img/chat/avatars/6.png';

const awesome_image = '../img/chat/awesome-meme.jpg';

let users = [
    {
        id: 1,
        name: 'Jane',
        surname: 'Rowlis',
        username: 'J_Rowlis',
        jobtitle: 'CEO & Founder',
        tel: '+375 29 243 14 12',
        avatar: p1,
        isOnline: true
    },
    {
        id: 2,
        name: 'Sam',
        surname: 'Fisher',
        username: 'S_Fisher',
        jobtitle: 'Web Developer',
        tel: '+375 29 379 56 67',
        avatar: p2,
        isOnline: false,
    },
    {
        id: 3,
        name: 'Jane',
        surname: 'Bredly',
        username: 'J_Bredly',
        jobtitle: 'Web Developer',
        tel: '+375 29 121 24 34',
        avatar: p3,
        isOnline: false,
    },
    {
        id: 4,
        name: 'John',
        surname: 'Hubbard',
        username: 'J_Hubbard',
        jobtitle: 'Operations manager',
        tel: '+375 29 230 94 51',
        avatar: p5,
        isOnline: true
    },
    {
        id: 5,
        name: 'Darrell',
        surname: 'Jackson',
        username: 'D_Jackson',
        jobtitle: 'Office manager',
        tel: '+375 29 404 64 56',
        avatar: p4,
        isOnline: true
    }
    ];

const chats = [
    {
        id: 0,
        name: 'Light Blue Group',
        users: [2,3,4,5,1],
        createdBy: 3,
        createdAt: moment().subtract(1, 'd').subtract(5, 'm'),
        messages: [
            {
                id: 1,
                userId: 6,
                text: 'Hello, @John. Can you help me with Light Blue project? I cannot understand how it works.'
            },
            {
                id: 2,
                userId: 4,
                text: 'Hi, @Darrell. It\'s too easy. I can explain it too you if you have some minutes.'
            },
            {
                id: 3,
                userId: 5,
                text: '',
                attachments: [
                    {
                        id: 1,
                        type: 'image',
                        src: awesome_image
                    }
                ]
            },
            {
                id: 4,
                userId: 1,
                text: 'Guys did you see the new update of the Sing App from our competitors?'
            }
        ]
    },
    {
        id: 1,
        name: 'React Native',
        users: [1, 4, 5],
        createdBy: 4,
        createdAt: moment().subtract(1, 'd').subtract(5, 'm'),
        messages: [
            {
                id: 1,
                userId: 6,
                text: 'Hello, @John. Can you help me with Light Blue project? I cannot understand how it works.'
            },
            {
                id: 2,
                userId: 4,
                text: 'Hi, @Darrell. It\'s too easy. I can explain it too you if you have some minutes.'
            }
        ]
    },
    {
        id: 2,
        name: 'Common',
        users: [1, 4, 5],
        createdBy: 6,
        createdAt: moment().subtract(1, 'd').subtract(5, 'm'),
        messages: [
            {
                id: 1,
                userId: 6,
                text: 'Hello, @John. Can you help me with Light Blue project? I cannot understand how it works.'
            },
            {
                id: 2,
                userId: 4,
                text: 'Hi, @Darrell. It\'s too easy. I can explain it too you if you have some minutes.'
            }
        ]
    },
    {
        id: 3,
        users: [1, 2],
        messages: [
            {
                id: 1,
                userId: 1,
                text: 'How can we help? We’re here for you!'
            },
            {
                id: 2,
                userId: 2,
                text: 'Hey John, I am looking for the best admin template.\n' +
                    'Could you help me to find it out?'
            },
            {
                id: 3,
                userId: 2,
                text: 'It should be Bootstrap 4 compatible'
            },
            {
                id: 4,
                userId: 1,
                text: 'Absolutely!'
            },
            {
                id: 5,
                userId: 1,
                text: 'Modern admin is the responsive bootstrap 4 admin template!'
            }
        ]
    },
    {
        id: 4,
        users: [1, 3],
        messages: [
            {
                id: 1,
                userId: 3,
                text: 'If it takes long you can mail m...'
            }
        ]
    },
    {
        id: 5,
        users: [1, 4],
        messages: [
            {
                id: 1,
                userId: 4,
                text: 'If it takes long you can mail m...'
            }
        ]
    },
    {
        id: 6,
        users: [1, 5],
        messages: [
            {
                id: 1,
                userId: 5,
                text: 'If it takes long you can mail m...'
            }
        ]
    },
    {
        id: 7,
        users: [1, 6],
        messages: [
            {
                id: 1,
                userId: 5,
                text: 'If it takes long you can mail m...'
            }
        ]
    },
];

function chatDialogGenerator(id) {
    const dialog = chats[id].messages;

    let chatDialogBody = $('<div>', {
        'class': 'chat-dialog-body',
    });
    let dialogMessage = $('<div>', {
        'class': 'dialog-messages',
    });

    $(".chat-dialog-body").remove();

    dialog.forEach((item) => {

        let chatMessage = `<div class="chat-message ${item.userId === 1 ? "owner" : ''}">
                <div class="avatar message-avatar">
                    <div class="image-wrapper">
                        <img src='../img/chat/avatars/${item.userId}.png'>
                    </div>
                </div>
                <p class="message-body">
                    ${ item.attachments != undefined ?
                    `<img src="../img/chat/awesome-meme.jpg">` :
                    item.text}
                </p>
                <small class="d-block text-muted">
                    3:09 pm
                </small>
            </div>`;
        dialogMessage.append(chatMessage);
    });

    chatDialogBody.append(dialogMessage);
    $(".chat-dialog-header").after(chatDialogBody);
}

function chatInfoHeaderGenerator(gChatID, pChatID) {
        let infoHeader = $(".chat-info-header.chat-section.bg-info");
        let commonInfo = $("#common-info");
        let el = ``;

        if (gChatID === undefined) {
            // personal chat

            let name = users[pChatID].name;
            let username = users[pChatID].username;
            el = `<div class="d-flex mb-3">
                      <header>
                          <h3 class="mb-3 fw-semi-bold">${users[pChatID].name} ${users[pChatID].surname}</h3>
                          <h5>HighPark Inc</h5>
                          <h6>${users[pChatID].jobtitle}</h6>
                      </header>
                      <div class="avatar ml-auto mr-3">
                          <div class="image-wrapper">
                              <img src="${users[pChatID].avatar}">
                          </div>
                      </div>
                  </div>
                  <footer class="d-flex align-items-center justify-content-between">
                    <a href="mailto:J_Rowlis@gmail.com" class="text-white mt-2">${username}@gmail.com</a>
                    <ul class="social-links mt-2">
                        <li class="social-link">
                            <a href="https://www.facebook.com/${username}_lorem_ipsum">
                                <i class="fa fa-facebook"></i>
                            </a>
                        </li>
                        <li class="social-link">
                            <a href="https://twitter.com/${username}_lorem_ipsum">
                                <i class="fa fa-twitter"></i>
                            </a>
                        </li>
                        <li class="social-link">
                            <a href="https://www.linkedin.com/in/${username}_lorem_ipsum/">
                                <i class="fa fa-linkedin"></i>
                            </a>
                        </li>
                    </ul>
                  </footer>`;
            infoHeader.empty().append(el);

            el = `<div>
                    <p class="mb-0">${users[pChatID].tel}</p>
                    <span class="help-block">Mobile</span>
                    <p class="mb-0">@${name}</p>
                    <span class="help-block">${name}</span>
                </div>`;
            commonInfo.empty().append(el);

        } else {
            // group chat

            let chat = chats[gChatID];
            let name = chat.name;

            el = `<div class="d-flex align-items-center mb-3">
            <h4 class="mb-0 fw-semi-bold">${name}</h4>
                <ul class="avatars-row ml-auto">
                    <li>
                        <div class="avatar">
                            <div class="image-wrapper stroke">
                                <img src='../img/chat/avatars/${chat.users[0]}.png'>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="avatar">
                            <div class="image-wrapper stroke">
                                <img src='../img/chat/avatars/${chat.users[1]}.png'>
                             </div>
                         </div>
                    </li>
                    <li>
                        <div class="avatar">
                            <div class="image-wrapper stroke">
                            <img src='../img/chat/avatars/${chat.users[2]}.png'>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
                  <footer class="d-flex align-items-center justify-content-between">
                <a data-toggle="modal" data-target="#group-modal">
                    <h5 class="text-white mb-0">${chat.users.length} members</h5>
                </a>
                <button type="button" class="btn bg-white text-info fw-semi-bold">Add people</button>
            </footer>`;
            infoHeader.empty().append(el);

            el = `<div>
                      <p class="mb-0">${name}</p>
                      <span class="help-block">Name</span>
                      <p class="mb-0">by ${users[gChatID].name}</p>
                      <span class="help-block">Created</span>
                  </div>`;
            commonInfo.empty().append(el);
        }
    }

function modalGenerator(usersList, chatID) {

        if (chatID <= 3) {
            let groupList = $('<ul>', {
                'class': 'group-list'
            });
            let online = '<span class="text-info">Online</span>';
            let LastSeen = '<span>Last seen today at 11:22 AM</span>';

            $(".group-list-header h5").text(`${usersList.length} members`)

            $(".modal-content .group-list").remove();



            usersList.forEach( item => {
                let user = `<li>
                  <div class="avatar mr-2">
                      <div class="image-wrapper">
                          <img src="../img/chat/avatars/${item}.png">
                      </div>
                  </div>
                  <div>
                      <p class="mb-0">${users[item-1].name} ${users[item-1].surname}</p>
                      <small>
                          <p class="text-muted mb-0">
                              ${users[item-1].isOnline ? online : LastSeen}
                          </p>
                      </small>
                  </div>
              </li>`
                groupList.append(user);
            })

            $(".group-list-modal.chat-section").append(groupList);
        } else return;

    }

new Switchery(document.getElementById('checkbox-ios1'),  { size: 'small' });