
import type { Question } from '../types';
import { QuestionType, Level } from '../types';

export const flinkQuestions: Question[] = [
  {
    "id": 1,
    "type": QuestionType.MultipleChoice,
    "level": Level.Easy,
    "question": "Apache Flink 的主要功能是什么？",
    "options": [
      "A) 一个用于存储大型数据集的分布式文件系统。",
      "B) 一个用于历史数据分析的批处理引擎。",
      "C) 一个用于对无界和有界数据流进行有状态计算的框架和分布式处理引擎。",
      "D) 一个用于查询数据仓库的 SQL-on-Hadoop 工具。"
    ],
    "correct_answer": "C",
    "explanation": "Apache Flink 首先被设计为一个流处理框架，能够处理无界（流）和有界（批）数据。其核心优势在于有状态计算，使其能够维护上下文并在一段时间内记住信息，这对于复杂的事件处理至关重要。",
    "extension": "Flink 的架构通过将批处理视为流处理的一种特例，统一了批处理和流处理。这种“流优先”的理念与其他大数据框架（如 Apache Spark）有何不同？"
  },
  {
    "id": 2,
    "type": QuestionType.MultipleChoice,
    "level": Level.Easy,
    "question": "在 Flink 流处理中，哪两种时间语义是基础？",
    "options": [
      "A) 处理时间 (Processing Time) 和摄入时间 (Ingestion Time)",
      "B) 挂钟时间 (Wall-Clock Time) 和系统时间 (System Time)",
      "C) 事件时间 (Event Time) 和处理时间 (Processing Time)",
      "D) 逻辑时间 (Logical Time) 和物理时间 (Physical Time)"
    ],
    "correct_answer": "C",
    "explanation": "处理时间是指处理事件的机器的系统时钟时间。事件时间是嵌入在事件本身中的时间戳，表示事件实际发生的时间。使用事件时间可以确保即使在事件乱序或处理延迟的情况下也能得到一致的结果，这对于准确的流分析至关重要。",
    "extension": "Flink 中还存在第三种时间特性，即‘摄入时间’（Ingestion Time）。它在事件时间和处理时间之间处于什么位置，其主要用例是什么？"
  },
  {
    "id": 10,
    "type": QuestionType.QA,
    "level": Level.Easy,
    "question": "在 Flink 集群中，JobManager 的角色是什么？",
    "options": [],
    "correct_answer": "JobManager 是 Flink 集群中的主进程。它负责协调 Flink 作业的分布式执行。其关键任务包括接收作业图、将任务调度到 TaskManager 上、协调检查点以及在发生故障时管理作业恢复。",
    "explanation": "可以将 JobManager 视为 Flink 应用程序的“大脑”。它拥有作业的全局视图，并指导 TaskManager（即执行实际数据处理任务的“工人”）。高可用性设置通常涉及多个备用 JobManager。",
    "extension": "比较 Flink 的 JobManager 与其他分布式系统（如 YARN 的 ResourceManager 或 Spark 的 Driver）中相应主节点的角色。"
  },
  {
    "id": 3,
    "type": QuestionType.MultipleChoice,
    "level": Level.Medium,
    "question": "在 Flink 的 DataStream API 中，什么定义了'滚动窗口'（Tumbling Window）？",
    "options": [
      "A) 一个以指定滑动间隔在数据流上滑动的窗口。",
      "B) 一个根据会话间隙超时对元素进行分组的窗口。",
      "C) 一系列固定大小、不重叠且连续的窗口。",
      "D) 一个包含流中所有数据的全局单一视图的窗口。"
    ],
    "correct_answer": "C",
    "explanation": "滚动窗口将流离散化为固定大小、不重叠的块。例如，一个5分钟的滚动窗口将收集在5分钟间隔内到达的所有事件，处理它们，然后开始一个新的5分钟窗口。任何元素都不能属于多个滚动窗口。",
    "extension": "‘滑动窗口’（Sliding Window）与‘滚动窗口’有何不同？提供一个更适合使用滑动窗口的用例，例如计算每5分钟更新一次的30分钟移动平均值。"
  },

  {
    "id": 4,
    "type": QuestionType.QA,
    "level": Level.Medium,
    "question": "在 DataStream API 中，`map()` 和 `flatMap()` 转换的根本区别是什么？",
    "options": [],
    "correct_answer": "`map()` 转换接收一个元素作为输入，并精确地产生一个元素作为输出（一对一映射）。`flatMap()` 转换接收一个元素作为输入，但可以产生零个、一个或多个元素作为输出（一对多映射）。",
    "explanation": "`map` 函数用于简单的转换，例如将字符串转换为大写或从对象中提取单个字段。当单个输入元素可以产生多个输出元素时，例如将一个句子（一个字符串）拆分为单个单词（多个字符串），则使用 `flatMap` 函数。",
    "extension": "另一个常见的转换是 `filter()`。它与 `flatMap()` 有何关系？你能否仅使用 `flatMap()` 实现 `filter()` 操作？"
  },
  {
    "id": 5,
    "type": QuestionType.MultipleChoice,
    "level": Level.Medium,
    "question": "对于需要大状态和高容错性的生产 Flink 作业，通常推荐使用哪种状态后端？",
    "options": [
      "A) MemoryStateBackend",
      "B) FsStateBackend",
      "C) RocksDBStateBackend",
      "D) CassandraStateBackend"
    ],
    "correct_answer": "C",
    "explanation": "RocksDBStateBackend 将状态存储在嵌入式 RocksDB 实例的本地磁盘上。这使其能够管理远超可用内存的状态大小。它还支持高效的增量检查点，使其成为大多数具有非平凡状态的生产用例的稳健和可扩展的选择。",
    "extension": "虽然 RocksDB 功能强大，但由于状态必须在 JVM 堆和堆外/磁盘存储之间移动，它引入了序列化/反序列化的开销。在哪些特定场景下，FsStateBackend 可能是比 RocksDBStateBackend 更好的选择？"
  },
  {
    "id": 6,
    "type": QuestionType.MultipleChoice,
    "level": Level.Medium,
    "question": "在 Flink 集群中，TaskManager 的主要职责是什么？",
    "options": [
      "A) 从客户端接受作业提交并构建作业图。",
      "B) 管理集群资源和调度作业。",
      "C) 执行数据流的并行任务，并管理它们的状态和网络缓冲区。",
      "D) 提供 Flink Web UI 和 REST API。"
    ],
    "correct_answer": "C",
    "explanation": "TaskManager 是 Flink 集群中的工作节点。它们执行作业图中定义的实际数据处理逻辑。每个 TaskManager 都有若干个任务槽（task slots），这些是资源分配的单位，单个并行任务（例如 map 或 reduce 函数）在其中运行。",
    "extension": "什么是‘任务槽’（Task Slots），它们的配置如何影响 Flink 作业的并行度和集群内的资源利用率？"
  },
  {
    "id": 9,
    "type": QuestionType.MultipleChoice,
    "level": Level.Medium,
    "question": "在 Flink Connectors 的上下文中，'Sink'（接收器）的用途是什么？",
    "options": [
      "A) 从外部系统读取数据到 Flink 流中。",
      "B) 在 Flink 作业内部将数据从一种格式转换为另一种格式。",
      "C) 将数据从 Flink 流写入到外部系统。",
      "D) 在不同的并行任务之间对数据进行分区。"
    ],
    "correct_answer": "C",
    "explanation": "一个 Flink 作业通常由源（sources）、转换（transformations）和接收器（sinks）组成。'Source' 是数据的来源（例如 Kafka、Kinesis）。转换是处理逻辑。'Sink' 是处理后数据的目的地（例如数据库、另一个 Kafka 主题或文件系统）。",
    "extension": "现代 Flink Sink 通常支持不同的交付保证，如‘至少一次’（at-least-once）和‘精确一次’（exactly-once）。像 Flink Kafka Sink 这样的接收器使用什么机制来提供精确一次的语义？"
  },
  {
    "id": 7,
    "type": QuestionType.QA,
    "level": Level.Hard,
    "question": "解释 Apache Flink 中检查点（Checkpoint）和保存点（Savepoint）之间的主要区别。",
    "options": [],
    "correct_answer": "检查点（Checkpoints）是为容错而创建的作业状态的自动、定期快照。其主要目的是从故障中透明地恢复作业。它们完全由 Flink 管理，并且在作业终止时通常会被丢弃。\n保存点（Savepoints）是手动触发的作业状态快照。其主要目的是用于计划内的运维任务，例如更新应用程序代码、更改作业并行度或将作业迁移到不同的集群。它们使用与检查点相同的机制，但由用户拥有和管理。",
    "explanation": "核心区别在于意图和生命周期。检查点用于自动恢复（内部的，由 Flink 管理），而保存点用于手动操作和更新（外部的，由用户管理）。你可以从保存点恢复一个作业，但通常不会直接与检查点交互，除非发生故障。",
    "extension": "什么是‘非对齐检查点’（unaligned checkpointing），与传统的对齐检查点相比，它如何帮助具有高反压的 Flink 作业更有效地处理检查点？"
  },
  {
    "id": 8,
    "type": QuestionType.MultipleChoice,
    "level": Level.Hard,
    "question": "当使用事件时间时，对于在水印（Watermark）已经超过其对应窗口关闭时间后到达的元素，Flink 通常如何处理？",
    "options": [
      "A) 元素会立即被丢弃并记录一条错误日志。",
      "B) 作业会自动失败并需要手动重启。",
      "C) 元素会在下一个可用的窗口中被处理。",
      "D) 元素被视为‘迟到’，可以通过旁路输出（side outputs）处理，或者默认被丢弃。"
    ],
    "correct_answer": "D",
    "explanation": "默认情况下，迟到的元素（即它们的时间戳早于当前水印）会被丢弃。然而，Flink 提供了处理它们的机制。可以在窗口流上使用 `sideOutputLateData()` 算子来捕获这些迟到事件到一个单独的数据流中，以便进一步处理或记录，从而防止数据丢失。",
    "extension": "Flink 还有一个 `allowedLateness()` 算子。它的功能与使用旁路输出处理迟到数据有何不同？在什么情况下你会选择使用其中一种？"
  }
];
