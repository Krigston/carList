//проверяем наличие элемента в local Storage
if (!localStorage.getItem('goods')){
    localStorage.setItem('goods', JSON.stringify([]))
}
//параметры для поиска
let options = {
    valueNames: ['name', 'price']
}

let userList

//кнопка для добавления нового автомобиля
document.querySelector("button.add_new").addEventListener('click', function (e){
    let name = document.getElementById('good_name').value
    let model = document.getElementById('good_model').value
    let color = document.getElementById('good_color').value
    let count = document.getElementById('good_count').value
    let price = document.getElementById('good_price').value
    if(name && model && color && count && price) {
        document.getElementById('good_name').value = ""
        document.getElementById('good_model').value = ""
        document.getElementById('good_color').value = ""
        document.getElementById('good_count').value = "1"
        document.getElementById('good_price').value = "1"
        //конвертируем полученные данные в массив
        let goods = JSON.parse(localStorage.getItem('goods'))
        goods.push(['good_'+goods.length, name, model, color, count, price, 0, 0, 0])
        localStorage.setItem('goods', JSON.stringify(goods))
        //обновить отображение интерфейса
        update_goods()
        //закрыть окно после ввода данных
        //сообщение об ошибке при неверном вводе данных
    }
})

update_goods()

function update_goods(){
    let tbody = document.querySelector('.list')
    tbody.innerHTML = ""
    let goods = JSON.parse(localStorage.getItem('goods'))
    if(goods.length){
        table1.hidden = false
        for (let i = 0; i<goods.length; i++ ){
            tbody.insertAdjacentHTML('beforeend',
                `
                <tr class="align-middle">
                    <td class="table_head__number">${i+1}</td>
                    <td class="name table_head__item">${goods[i][1]}</td>
                    <td class="model table_head__item">${goods[i][2]}</td>
                    <td class="color table_head__item">${goods[i][3]}</td>
                    <td class="count table_head__item">${goods[i][4]}</td>
                    <td class="price table_head__item">${goods[i][5]}</td>
                    <td> <button class="good_delete btn_delete--position" data-delete="${goods[i][0]}">✖</button></td>
                    <td> <button class="good_delete btn_refactor--position" data-goods="${goods[i][0]}">✎</button></td>
                </tr>
                `
            )
        }
        //использование библиотеки для поиска
        userList = new List('goods', options);
    } else {
        table1.hidden = true;
    }
}