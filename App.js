import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ListItem, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useState } from 'react';
const COLORS = { primary: '#1f145c', white: '#fff' };

const App = () => {
  const [textInput, setTextInput] = useState('')
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  useEffect(() => {
    saveTodoTouserDevice(todos);
  }, [todos]);

  const ListItem = ({ todo }) => {
    return <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 15, color: COLORS.primary, textDecorationLine: todo?.completed ? 'line-through' : 'none', }}>
          {todo?.task}
        </Text>
      </View>

      {
        !todo?.completed && (
          <TouchableOpacity
            style={[styles.actionIcon]}
            onPress={() => markTodoComplete(todo?.id)}>
            <Icon name='done' size={20} color={COLORS.white} />
          </TouchableOpacity>
        )
      }
      <TouchableOpacity
        style={[styles.actionIcon, { backgroundColor: 'red' }]}
        onPress={() => deleteTodo(todo?.id)}
      >
        <Icon name='delete' size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  };
  const saveTodoTouserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  const getTodosFromUserDevice = async todos => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  }
  const addTodo = () => {
    console.log(textInput)
    if (textInput == '') {
      Alert.alert('Error', "Please Enter Todo");
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };
  const markTodoComplete = (todoId) => {
    console.log(todoId)
    const newTodo = todos.map((item) => {
      if (item.id == todoId) {
        return { ...item, completed: true }
      }
      return item;
    });
    setTodos(newTodo);
  };

  const deleteTodo = (todoId) => {
    const newTodos = todos.filter(item => item.id != todoId);
    setTodos(newTodos);
  };

  const clearTodos = () => {
    Alert.alert("Confirm", "Clear all todos?", [{
      text: 'yes',
      onPress: () => setTodos([]),
    },
    { text: 'No' },
    ])

  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColorL: COLORS.white }}>
      <View style={styles.header}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: COLORS.primary }}>TODO APP</Text>
        <Icon name="delete" size={25} color="red" onPress={clearTodos} />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput placeholder="Add Todo"
            value={textInput}
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default App

const styles = StyleSheet.create({
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
})