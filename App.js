import React, { useState } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Navbar } from './src/components/Navbar'
import { MainScreen } from './src/screens/MainScreen'
import { TodoScreen } from './src/screens/TodoScreen'

export default function App() {
    const [todos, setTodos] = useState([])
    const [todoId, setTodoId] = useState(null)

    const addTodo = title => {
        // const newTodo = {
        //   id: Date.now().toString(),
        //   title
        // }

        // setTodos((prevTodos) => {
        //   return [
        //     ...prevTodos,
        //     newTodo
        //   ]
        // })
        setTodos(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                title
            }
        ])
    }

    const removeTodo = id => {
        const todo = todos.find(t => t.id === id)
        Alert.alert(
            'Удаление заметки',
            `Вы уверенны что хотите удалить ${todo.title}?`,
            [
                {
                    text: 'Отмена',
                    style: 'cancel'
                },
                { text: 'Удалить', onPress: () => {
                    setTodoId(null)
                    setTodos(prev => prev.filter(todo => todo.id != id))
                } }
            ],
            { cancelable: false }
        )

        
    }

    const updateTodo = (id, title) => {
        setTodos(old => old.map(todo => {
            if (todo.id === id) {
                todo.title = title
            }
            return todo
        }))
    }

    let content = (
        <MainScreen
            todos={todos}
            addTodo={addTodo}
            removeTodo={removeTodo}
            openTodo={setTodoId}
            // то же самое что и openTodo={id => setTodoId(id)}
        />
    )

    if (todoId) {
        const selectedTodo = todos.find(todo => todo.id === todoId)
        content = (
            <TodoScreen goBack={() => setTodoId(null)} todo={selectedTodo} onRemove={removeTodo} onSave={updateTodo} />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Navbar title='Todo App!' />
            <View style={styles.container}>{content}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 20
    }
})
