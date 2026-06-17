import './style.css'

const STORAGE_KEY = 'todo-app-tasks'

// 从本地存储加载任务
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

// 保存任务到本地存储
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

let tasks = loadTasks()

// 获取优先级标签
function getPriorityLabel(priority) {
  const labels = { high: '高', medium: '中', low: '低' }
  return labels[priority] || '中'
}

// 渲染任务列表
function renderTasks() {
  const listEl = document.getElementById('todo-list')
  listEl.innerHTML = ''

  if (tasks.length === 0) {
    const emptyMsg = document.createElement('div')
    emptyMsg.className = 'empty-message'
    emptyMsg.innerHTML = '<span class="empty-icon">📝</span><p>暂无任务，添加一个吧！</p>'
    listEl.appendChild(emptyMsg)
  } else {
    tasks.forEach((task, index) => {
      const li = document.createElement('li')
      li.className = 'todo-item' + (task.completed ? ' completed' : '') + ` priority-${task.priority || 'medium'}`

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = task.completed
      checkbox.addEventListener('change', () => toggleTask(index))

      const priorityTag = document.createElement('span')
      priorityTag.className = 'priority-tag'
      priorityTag.textContent = getPriorityLabel(task.priority || 'medium')
      priorityTag.addEventListener('click', () => cyclePriority(index))

      const span = document.createElement('span')
      span.className = 'todo-text'
      span.textContent = task.text
      span.addEventListener('dblclick', () => editTask(index))

      const editBtn = document.createElement('button')
      editBtn.className = 'edit-btn'
      editBtn.textContent = '编辑'
      editBtn.addEventListener('click', () => editTask(index))

      const deleteBtn = document.createElement('button')
      deleteBtn.className = 'delete-btn'
      deleteBtn.textContent = '删除'
      deleteBtn.addEventListener('click', () => deleteTask(index))

      li.appendChild(checkbox)
      li.appendChild(priorityTag)
      li.appendChild(span)
      li.appendChild(editBtn)
      li.appendChild(deleteBtn)
      listEl.appendChild(li)
    })
  }

  updateStats()
}

// 更新统计信息
function updateStats() {
  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.length - completed

  document.getElementById('completed-count').textContent = completed
  document.getElementById('pending-count').textContent = pending
}

// 添加任务
function addTask() {
  const input = document.getElementById('todo-input')
  const prioritySelect = document.getElementById('priority-select')
  const text = input.value.trim()

  if (!text) return

  tasks.push({ text, completed: false, priority: prioritySelect.value })
  saveTasks(tasks)
  renderTasks()

  input.value = ''
  input.focus()
}

// 切换任务完成状态
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed
  saveTasks(tasks)
  renderTasks()
}

// 循环切换优先级
function cyclePriority(index) {
  const priorities = ['low', 'medium', 'high']
  const current = tasks[index].priority || 'medium'
  const currentIndex = priorities.indexOf(current)
  tasks[index].priority = priorities[(currentIndex + 1) % priorities.length]
  saveTasks(tasks)
  renderTasks()
}

// 编辑任务
function editTask(index) {
  const newText = prompt('编辑任务内容：', tasks[index].text)
  if (newText !== null && newText.trim()) {
    tasks[index].text = newText.trim()
    saveTasks(tasks)
    renderTasks()
  }
}

// 删除任务
function deleteTask(index) {
  tasks.splice(index, 1)
  saveTasks(tasks)
  renderTasks()
}

// 清空已完成的任务
function clearCompleted() {
  const completedCount = tasks.filter(t => t.completed).length
  if (completedCount === 0) {
    alert('没有已完成的任务')
    return
  }
  if (confirm(`确定要清空 ${completedCount} 个已完成的任务吗？`)) {
    tasks = tasks.filter(t => !t.completed)
    saveTasks(tasks)
    renderTasks()
  }
}

// 清空全部任务
function clearAll() {
  if (tasks.length === 0) {
    alert('暂无任务')
    return
  }
  if (confirm(`确定要清空全部 ${tasks.length} 个任务吗？此操作不可撤销！`)) {
    tasks = []
    saveTasks(tasks)
    renderTasks()
  }
}

// 初始化应用
document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>📋 我的待办清单</h1>
    <div class="input-section">
      <input type="text" id="todo-input" placeholder="今天要做什么？" />
      <select id="priority-select">
        <option value="low">低</option>
        <option value="medium" selected>中</option>
        <option value="high">高</option>
      </select>
      <button id="add-btn">➕ 添加任务</button>
    </div>
    <div class="stats">
      <span>未完成: <strong id="pending-count">0</strong></span>
      <span>已完成: <strong id="completed-count">0</strong></span>
    </div>
    <ul id="todo-list"></ul>
    <div class="action-buttons">
      <button id="clear-btn">清空已完成</button>
      <button id="clear-all-btn">全部清空</button>
    </div>
  </div>
`

// 绑定事件
document.getElementById('add-btn').addEventListener('click', addTask)
document.getElementById('todo-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask()
})
document.getElementById('clear-btn').addEventListener('click', clearCompleted)
document.getElementById('clear-all-btn').addEventListener('click', clearAll)

// 初始渲染
renderTasks()
