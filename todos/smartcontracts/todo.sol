// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract TodoList {
    enum TodoPriority {
        LOW,
        NORMAL,
        HIGH
    }

    struct Todo {
        int256 id;
        string title;
        string category;
        TodoPriority priority;
        address owner;
        bool iscompleted;
    }

    mapping(address => int256[]) public _userTodosLookup;
    mapping(int256 => Todo) public _todosIdsLookup;
    int256 _idcounter;

    constructor() {
        // sample tasks for testing...
        addTodo("fix AC leak", "home", TodoPriority.HIGH);
        addTodo("buy groceries", "home", TodoPriority.NORMAL);
        addTodo("buy netflix", "home", TodoPriority.LOW);
    }

    event TaskCreated(address indexed sender, Todo todo);
    event TaskUpdated(address indexed sender, Todo todo);
    event TaskCompleted(address indexed sender, Todo todo);

    function addTodo(
        string memory title,
        string memory category,
        TodoPriority priority
    ) public returns (Todo memory) {
        Todo memory thisTodo = Todo(
            _idcounter++,
            title,
            category,
            priority,
            msg.sender,
            false
        );
        _userTodosLookup[msg.sender].push(thisTodo.id);
        _todosIdsLookup[thisTodo.id] = thisTodo;
        emit TaskCreated(msg.sender, thisTodo);
        return thisTodo;
    }

    function getTodo(int256 id) public view returns (Todo memory) {
        return _todosIdsLookup[id];
    }

    modifier onlyTodoOwner(int256 id, address target) {
        Todo memory thisTodo = _todosIdsLookup[id];
        require(thisTodo.owner == msg.sender);
        require(!thisTodo.iscompleted);
        _;
    }

    function getMyTodos() public view returns (Todo[] memory) {
        int256[] memory myTaskIds = _userTodosLookup[msg.sender];
        Todo[] memory myTasks = new Todo[](myTaskIds.length);
        for (uint256 i = 0; i < myTaskIds.length; i++) {
            Todo memory t = _todosIdsLookup[myTaskIds[i]];
            myTasks[i] = t;
        }
        return myTasks;
    }

    function markCompleted(int256 id)
        public
        onlyTodoOwner(id, msg.sender)
        returns (Todo memory)
    {
        _todosIdsLookup[id].iscompleted = true;
        Todo memory thisTodo = _todosIdsLookup[id];
        emit TaskCompleted(msg.sender, thisTodo);
        return thisTodo;
    }

    function updateTodo(
        int256 id,
        string memory title,
        string memory category,
        TodoPriority priority
    ) public onlyTodoOwner(id, msg.sender) returns (Todo memory) {
        _todosIdsLookup[id].title = title;
        _todosIdsLookup[id].category = category;
        _todosIdsLookup[id].priority = priority;
        Todo memory thisTodo = _todosIdsLookup[id];
        emit TaskUpdated(msg.sender, thisTodo);
        return thisTodo;
    }
}
