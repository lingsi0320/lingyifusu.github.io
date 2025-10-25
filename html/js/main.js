// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 加载动画
  const loader = document.querySelector('.loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1000);
  
  // 导航栏当前页面高亮
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    // 处理首页
    if (currentPath === '/index.html' && linkPath === '/index.html') {
      link.classList.add('active');
    }
    // 处理其他页面
    else if (currentPath.includes(linkPath) && linkPath !== '/index.html') {
      link.classList.add('active');
    }
  });

  // 留言板功能
  const messageForm = document.getElementById('messageForm');
  const messagesContainer = document.getElementById('messages');
  
  // 从localStorage加载留言
  loadMessages();
  
  // 表单提交事件
  messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (name && message) {
      // 创建新留言
      const newMessage = {
        id: Date.now(),
        name: name,
        text: message,
        date: new Date().toLocaleString()
      };
      
      // 保存留言到localStorage
      saveMessage(newMessage);
      
      // 添加留言到页面
      addMessageToDOM(newMessage);
      
      // 清空表单
      nameInput.value = '';
      messageInput.value = '';
      
      // 显示成功提示
      showNotification('留言发布成功');
    }
  });
  
  // 保存留言到localStorage
  function saveMessage(message) {
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
  }
  
  // 从localStorage加载留言
  function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.forEach(message => {
      addMessageToDOM(message);
    });
  }
  
  // 添加留言到DOM
  function addMessageToDOM(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.dataset.id = message.id;
    messageElement.innerHTML = `
      <div class="message-header">
        <h4>${message.name}</h4>
        <button class="delete-btn" data-id="${message.id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
      <p>${message.text}</p>
      <div class="date">${message.date}</div>
    `;
    
    // 添加动画效果
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(20px)';
    
    messagesContainer.prepend(messageElement);
    
    // 触发动画
    setTimeout(() => {
      messageElement.style.transition = 'all 0.5s ease';
      messageElement.style.opacity = '1';
      messageElement.style.transform = 'translateY(0)';
    }, 10);
    
    // 添加删除按钮事件监听
    const deleteBtn = messageElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
      const messageId = parseInt(this.dataset.id);
      deleteMessage(messageId);
      // 添加删除动画
      messageElement.style.opacity = '0';
      messageElement.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        messageElement.remove();
      }, 300);
      showNotification('留言已删除');
    });
  }
  
  // 从localStorage删除留言
  function deleteMessage(id) {
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages = messages.filter(message => message.id !== id);
    localStorage.setItem('messages', JSON.stringify(messages));
  }
  
  // 显示通知
  function showNotification(text) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = text;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'rgba(155, 70, 46, 0.8)';
    notification.style.color = '#d1c9b4';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    document.body.appendChild(notification);
    
    // 触发动画
    setTimeout(() => {
      notification.style.transition = 'all 0.3s ease';
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // 自动消失
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // 卡片悬停效果
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.7)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    });
  });
  
  // 导航栏滚动效果
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.style.backgroundColor = 'rgba(5, 7, 9, 0.9)';
      nav.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
    } else {
      nav.style.backgroundColor = 'rgba(5, 7, 9, 0.8)';
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    }
  });
  
  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
