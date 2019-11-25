import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native'
import { AddTodo } from '../components/AddTodo'
import { Todo } from '../components/Todo'
import { THEME } from '../theme'
import { TodoContext } from '../context/todo/todoContext'
import { ScreenContext } from '../context/screen/screenContext'
import { AppLoader } from '../components/ui/AppLoader'
import { AppText } from '../components/ui/AppText'
import { AppButton } from '../components/ui/AppButton'

export const MainScreen = () => {
    const {
        addTodo,
        todos,
        removeTodo,
        fetchTodos,
        loading,
        error
    } = useContext(TodoContext)
    const { changeScreen } = useContext(ScreenContext)
    const [deviceWidth, setDeviceWidth] = useState(
        Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2
    )

    const loadTodos = useCallback(async () => {
        await fetchTodos(), [fetchTodos]
    })

    useEffect(() => {
        loadTodos()
    }, [])

    useEffect(() => {
        const update = () => {
            const width =
                Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2
            setDeviceWidth(width)
        }

        Dimensions.addEventListener('change', update)

        return () => {
            Dimensions.removeEventListener('change', update)
        }
    })

    if (loading) {
        return <AppLoader />
    }

    if (error) {
        return (
            <View style={styles.center}>
                <AppText style={styles.error}>{error}</AppText>
                <AppButton onPress={loadTodos} color={THEME.DANGER_COLOR}>
                    Повторить
                </AppButton>
            </View>
        )
    }

    let content = (
        <FlatList
            data={todos}
            keyExtractor={todo => todo.id}
            renderItem={({ item }) => (
                <Todo todo={item} onRemove={removeTodo} onOpen={changeScreen} />
            )}
        />
    )

    if (todos.length === 0) {
        content = (
            <View style={styles.imageWrap}>
                <Image
                    style={styles.image}
                    source={require('./../../assets/no-items.png')}
                    resizeMode='contain'
                />
            </View>
        )
    }

    return (
        <View>
            <AddTodo onSubmit={addTodo} />
            {content}
        </View>
    )
}

const styles = StyleSheet.create({
    imageWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        height: 300
    },
    image: {
        width: '100%',
        height: '100%'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    error: {
        color: THEME.DANGER_COLOR,
        fontSize: 20
    }
})
