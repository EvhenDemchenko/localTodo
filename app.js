class Todo20 {
    constructor() {
        this.form = document.querySelector('#js-form');
        this.todoContainer = document.querySelector('.list-group');
        this.navTabs = document.querySelector('.nav-tabs');
        this.formInput = document.querySelector('#form2');
        this.formBtn = document.querySelector('.btn');
        this.Init();

        this.navTabs.addEventListener('click', event => {
            this.ShowActivePosts(event)
        })

        this.todoContainer.addEventListener('click', e => {
            this.RemovePostFromServer(e)
        })

        this.form.addEventListener('click', e => {
            e.preventDefault();
            if (e.target === this.formBtn) {
                this.CreateTask();
            }
        })
    }

    ShowActivePosts(event) {
        this.links = document.querySelectorAll('.nav-link')
        this.links.forEach(item=>{
            item.classList.remove('active')
        })
        if (event.target.parentElement.dataset.nav === 'active') {
            event.target.classList.add('active')
            this.RenderActive(this.state)

        } else if (event.target.parentElement.dataset.nav === 'completed') {
            event.target.classList.add('active')

            this.RenderCompleted(this.state)
        } else if (event.target.parentElement.dataset.nav === 'all') {
            event.target.classList.add('active')

            this.Render(this.state)
        }

    }

    Init() {
        fetch('http://localhost:3000/posts', {
            method: 'GET'
        })
            .then(response => {
                return response.json();
            }).then(data => {
            this.state = data;
            this.Render(data);
        })
    }

    SetTodoToServer(post) {
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
            .then(data => {
                return data.json()
            })
            .then(() => {
                this.Init();
            })
    }

    RemovePostFromServer(event) {
        if (event.target.classList.contains('list-group-item')) {
            this.currentItemID = +event.target.dataset.id;

            this.state.find((item, index, arr) => {
                if (item.id === this.currentItemID) {
                    this.taskItem = {
                        id: item.id,
                        title: item.title,
                        done: true
                    }
                    fetch(`http://localhost:3000/posts/${item.id}`, {
                        method: 'delete'
                    }).then(res => {
                        return res.json()
                    }).then(data => {
                        return this.SetTodoToServer(this.taskItem)
                    })
                }

            })
        }
    }

    CreateTask() {
        this.taskItem = {
            id: Date.now(),
            title: this.formInput.value,
            done: false
        };
        this.formInput.value = ''
        this.SetTodoToServer(this.taskItem)
        this.state.push(this.taskItem);
    };

    RenderActive(data) {
        this.todoContainer.innerHTML = ``;
        data.forEach(item => {
            if (item.done === false) {
                this.todoContainer.innerHTML +=
                    `<li data-id="${item.id}" class="list-group-item d-flex align-items-center border-0 mb-2 rounded"
                    style="background-color: #f4f6f7;">
                    <input class="form-check-input me-2" type="checkbox" value="" aria-label="..."/>
                    ${item.title}
                </li>`
            }
        });
    }

    RenderCompleted(data) {
        this.todoContainer.innerHTML = ``;
        data.forEach(item => {
            if (item.done === true) {
                this.todoContainer.innerHTML +=
                    `<li class="list-group-item d-flex align-items-center border-0 mb-2 rounded"
                    style="background-color: #f4f6f7;">
                    <input checked class="form-check-input me-2" type="checkbox" value="" aria-label="..."/>
                     <s>${item.title}</s>
                </li>`
            }
        });
    }

    Render(data) {
        this.todoContainer.innerHTML = ``;
        data.forEach(item => {
            if (item.done === false) {
                this.todoContainer.innerHTML +=
                    `<li data-id="${item.id}" class="list-group-item d-flex align-items-center border-0 mb-2 rounded"
                    style="background-color: #f4f6f7;">
                    <input class="form-check-input me-2" type="checkbox" value="" aria-label="..."/>
                    ${item.title}
                </li>`
            } else if (item.done === true) {
                this.todoContainer.innerHTML +=
                    `<li class="list-group-item d-flex align-items-center border-0 mb-2 rounded"
                    style="background-color: #f4f6f7;">
                    <input checked class="form-check-input me-2" type="checkbox" value="" aria-label="..."/>
                     <s>${item.title}</s>
                </li>`
            }
        });
    };
}

new Todo20()

